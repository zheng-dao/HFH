import * as cdk from '@aws-cdk/core';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
import * as ses from '@aws-cdk/aws-ses';
//import * as iam from '@aws-cdk/aws-iam';
//import * as sns from '@aws-cdk/aws-sns';
//import * as subs from '@aws-cdk/aws-sns-subscriptions';
//import * as sqs from '@aws-cdk/aws-sqs';

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
    /* AWS CDK code goes here - learn more: https://docs.aws.amazon.com/cdk/latest/guide/home.html */

    const projectName = AmplifyHelpers.getProjectInfo().projectName;

    const environment = AmplifyHelpers.getProjectInfo().envName;

    let baseDomain = 'https://hfh.fisherhouse.org/';

    if (environment == 'dev') {
      baseDomain = 'https://dev-v3.hfh.fisherhouse.org/';
    } else if (environment == 'beta') {
      baseDomain = 'https://beta-v3.hfh.fisherhouse.org/';
    }

    const messageTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Announcement from Hotels for Heroes</title>
    </head>
    
    <body style="text-align: center;">
    
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="text-align: left; margin: 0 auto; max-width: 480px; font-size: 14pt;font-family: sans-serif; color: #333;">
      <tr>
        <td>
        <p style="text-align: left; margin: 4em 1em 1em 1em;">Dear {{name}},</p>
          <p style="text-align: left; margin: 0 1em 3em 1em;">A new announcment has been posted to the Hotels for Heroes system. Please see below.</p>
          <p style="text-align: left; margin: 0 1em 3em 1em;">{{main_announcement}}</p>
          <p style="text-align: left; margin: 0 1em 3em 1em;">{{secondary_announcement}}</p>
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          <img style="width: 80%; height: auto;" src="${baseDomain}img/hfh_email.gif" />
        </td>
      </tr>
    </table>
    
    </body>
    
    </html>
    `;

    // @ts-ignore
    const template = new ses.CfnTemplate(this, 'AnnouncementEmailSESTemplate', {
      template: {
        subjectPart: 'New Announcement from Hotels for Heroes',
        templateName: projectName + '-AnnouncementEmailSESTemplate-' + cdk.Fn.ref('env'),
        htmlPart: messageTemplate,
      },
    });

    // Example 1: Set up an SQS queue with an SNS topic

    /*
    const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();
    const sqsQueueResourceNamePrefix = `sqs-queue-${amplifyProjectInfo.projectName}`;
    const queue = new sqs.Queue(this, 'sqs-queue', {
      queueName: `${sqsQueueResourceNamePrefix}-${cdk.Fn.ref('env')}`
    });
    // 👇create sns topic
    
    const snsTopicResourceNamePrefix = `sns-topic-${amplifyProjectInfo.projectName}`;
    const topic = new sns.Topic(this, 'sns-topic', {
      topicName: `${snsTopicResourceNamePrefix}-${cdk.Fn.ref('env')}`
    });
    // 👇 subscribe queue to topic
    topic.addSubscription(new subs.SqsSubscription(queue));
    new cdk.CfnOutput(this, 'snsTopicArn', {
      value: topic.topicArn,
      description: 'The arn of the SNS topic',
    });
    */

    // Example 2: Adding IAM role to the custom stack
    /*
    const roleResourceNamePrefix = `CustomRole-${amplifyProjectInfo.projectName}`;
    
    const role = new iam.Role(this, 'CustomRole', {
      assumedBy: new iam.AccountRootPrincipal(),
      roleName: `${roleResourceNamePrefix}-${cdk.Fn.ref('env')}`
    }); 
    */

    // Example 3: Adding policy to the IAM role
    /*
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['*'],
        resources: [topic.topicArn],
      }),
    );
    */

    // Access other Amplify Resources
    /*
    const retVal:AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(this, 
      amplifyResourceProps.category, 
      amplifyResourceProps.resourceName, 
      [
        {category: <insert-amplify-category>, resourceName: <insert-amplify-resourcename>},
      ]
    );
    */
  }
}
