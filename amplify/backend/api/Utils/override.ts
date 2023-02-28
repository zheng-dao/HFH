// This file is used to override the REST API resources configuration
import { AmplifyApiRestResourceStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiRestResourceStackTemplate) {
  // resources.restApi.addPropertyOverride("Parameters", { "Header": "CloudFront-Viewer-Country" })
}
