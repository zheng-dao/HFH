export type AmplifyDependentResourcesAttributes = {
  api: {
    AdminQueries: {
      RootUrl: 'string';
      ApiName: 'string';
      ApiId: 'string';
    };
    Utils: {
      RootUrl: 'string';
      ApiName: 'string';
      ApiId: 'string';
    };
    hotelsforheroes: {
      GraphQLAPIKeyOutput: 'string';
      GraphQLAPIIdOutput: 'string';
      GraphQLAPIEndpointOutput: 'string';
    };
  };
  auth: {
    hotelsforheroes: {
      IdentityPoolId: 'string';
      IdentityPoolName: 'string';
      UserPoolId: 'string';
      UserPoolArn: 'string';
      UserPoolName: 'string';
      AppClientIDWeb: 'string';
      AppClientID: 'string';
      CreatedSNSRole: 'string';
    };
    userPoolGroups: {
      LiaisonsGroupRole: 'string';
      AdministratorsGroupRole: 'string';
    };
  };
  function: {
    AdminQueries5cfc6a1b: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    changeAdminEmail: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    changeLiaisonEmail: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    cleanupOldUsers: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
      CloudWatchEventRule: 'string';
    };
    cognitoCleanupTrigger: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
      CloudWatchEventRule: 'string';
    };
    confirmNewUserEmail: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    deactiveExpiredProfiles: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
      CloudWatchEventRule: 'string';
    };
    downloadPdf: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    emailApplicationFiles: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    exportCsvTrigger: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    exportCsvWorker: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    getCountry: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    getCurrentTimestamp: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    getIpAddress: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    getLiaisons: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    hotelsforheroesCustomMessage: {
      Name: 'string';
      Arn: 'string';
      LambdaExecutionRole: 'string';
      Region: 'string';
    };
    hotelsforheroesd502aea1: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    hotelsforheroesgeneratePdf: {
      Arn: 'string';
    };
    hotelsforheroesmakeAuthenticatedGraphqlRequest: {
      Arn: 'string';
    };
    hotelsforheroessendMailMessage: {
      Arn: 'string';
    };
    liaisonCheckoutWarning: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
      CloudWatchEventRule: 'string';
    };
    listAdmins: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyAdminsNewAccount: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyApplicationAction: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyApplicationApproved: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyApplicationCompleted: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyApplicationDeclined: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyApplicationException: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyApplicationNote: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyApplicationReturned: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyNewAnnouncement: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyNewApplicationRequested: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
    notifyOwnerAccountApproval: {
      Name: 'string';
      Arn: 'string';
      Region: 'string';
      LambdaExecutionRole: 'string';
    };
  };
  storage: {
    HFHFiles: {
      BucketName: 'string';
      Region: 'string';
    };
  };
};
