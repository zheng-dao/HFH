import { AmplifyApiGraphQlResourceStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiGraphQlResourceStackTemplate) {
  resources.opensearch.OpenSearchDomain.encryptionAtRestOptions = { enabled: true };
  resources.opensearch.OpenSearchDomain.nodeToNodeEncryptionOptions = { enabled: true };
  resources.opensearch.OpenSearchDomain.elasticsearchClusterConfig = {
    instanceType: 't3.medium.elasticsearch',
  };

  // Increase boolean clause count because this search page is HEAVY.
  resources.opensearch.OpenSearchDomain.advancedOptions = {
    'indices.query.bool.max_clause_count': '2147483647',
  };

  resources.api.GraphQLAPI.xrayEnabled = true;

  // resources.models.User.appsyncFunctions[
  //   'MutationupdateUserauth0FunctionMutationupdateUserauth0Function.AppSyncFunction'
  // ].dataSourceName = 'UserTable';
  // resources.models.User.appsyncFunctions[
  //   'MutationupdateUserauth1FunctionMutationupdateUserauth1Function.AppSyncFunction'
  // ].dataSourceName = 'UserTable';
}
