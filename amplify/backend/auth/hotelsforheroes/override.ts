import { AmplifyAuthCognitoStackTemplate } from '@aws-amplify/cli-extensibility-helper';
import { AuthContext } from './config-auth-override';

export function override(resources: AmplifyAuthCognitoStackTemplate) {
  let baseDomain = '';
  let sourceArn = '';

  switch (AuthContext.environment) {
    case 'dev':
      baseDomain = 'dev-v3.hfh.fisherhouse.org';
      sourceArn = 'arn:aws:ses:us-east-1:744473394486:identity/dev-v3.hfh.fisherhouse.org';
      break;

    case 'beta':
      baseDomain = 'beta-v3.hfh.fisherhouse.org';
      sourceArn = 'arn:aws:ses:us-east-1:744473394486:identity/beta-v3.hfh.fisherhouse.org';
      break;

    case 'mini-dev':
      baseDomain = 'mini-dev-v3.hfh.fisherhouse.org';
      sourceArn = 'arn:aws:ses:us-east-1:744473394486:identity/mini-dev-v3.hfh.fisherhouse.org';
      break;

    case 'staging':
      baseDomain = 'staging-v3.hfh.fisherhouse.org';
      sourceArn = 'arn:aws:ses:us-east-1:744473394486:identity/staging-v3.hfh.fisherhouse.org';
      break;

    case 'pre-production':
      baseDomain = 'pre-production-v3.hfh.fisherhouse.org';
      sourceArn =
        'arn:aws:ses:us-east-1:744473394486:identity/pre-production-v3.hfh.fisherhouse.org';
      break;

    default:
      baseDomain = 'fisherhouse.org';
      sourceArn = 'arn:aws:ses:us-east-1:744473394486:identity/fisherhouse.org';
      break;
  }

  resources.userPool.emailConfiguration = {
    emailSendingAccount: 'DEVELOPER',
    from: 'Hotels for Heroes <no-reply@' + baseDomain + '>',
    sourceArn,
  };

  resources.customMessageConfirmationBucket.websiteConfiguration = {
    indexDocument: 'index.html',
    errorDocument: 'index.html',
  };
}
