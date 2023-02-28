import * as cdk from '@aws-cdk/core';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
import * as iam from '@aws-cdk/aws-iam';
//import * as sns from '@aws-cdk/aws-sns';
//import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as les from '@aws-cdk/aws-lambda-event-sources';
import * as lambda from '@aws-cdk/aws-lambda';

export class cdkStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props?: cdk.StackProps,
    amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps
  ) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });

    const queue = new sqs.Queue(this, 'sqs-export-csv-queue', {
      queueName: 'export-csv-' + cdk.Fn.ref('env'),
      encryption: sqs.QueueEncryption.KMS_MANAGED,
      visibilityTimeout: cdk.Duration.seconds(660),
    });

    const dependencies: AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(
      this,
      amplifyResourceProps.category,
      amplifyResourceProps.resourceName,
      [
        { category: 'function', resourceName: 'exportCsvTrigger' },
        { category: 'function', resourceName: 'exportCsvWorker' },
      ]
    );

    const lambdaProcessingFunctionArn = cdk.Fn.ref(dependencies.function.exportCsvWorker.Arn);

    const lambdaEventSource = new les.SqsEventSource(queue);

    const lambdaProcessingRole = iam.Role.fromRoleName(
      this,
      'lambda-role',
      cdk.Fn.ref(dependencies.function.exportCsvWorker.LambdaExecutionRole)
    );

    const lambdaProcessingFunction = lambda.Function.fromFunctionAttributes(
      this,
      'lambda-processing-function',
      {
        role: lambdaProcessingRole,
        functionArn: lambdaProcessingFunctionArn,
      }
    );

    lambdaProcessingFunction.addEventSource(lambdaEventSource);

    const lambdaSendingRole = iam.Role.fromRoleName(
      this,
      'lambda-sending-role',
      cdk.Fn.ref(dependencies.function.exportCsvTrigger.LambdaExecutionRole)
    );

    queue.grantSendMessages(lambdaSendingRole);
  }
}
