/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_HOTELSFORHEROES_GRAPHQLAPIIDOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIKEYOUTPUT
	EMAIL_REWRITE_ENABLED
Amplify Params - DO NOT EDIT */

const https = require('https');
const AWS = require('aws-sdk');
const urlParse = require('url').URL;
const appsyncUrl = process.env.API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;
const ses = new AWS.SES({ region: 'us-east-1' });

const getConfigurationSettingByName = /* GraphQL */ gql`
  query GetConfigurationSettingByName(
    $name: String!
    $sortDirection: ModelSortDirection
    $filter: ModelConfigurationSettingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getConfigurationSettingByName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        value
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const usersByStatus = /* GraphQL */ gql`
  query UsersByStatus(
    $status: USERSTATUS!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    UsersByStatus(
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        first_name
        last_name
        receive_emails
      }
      nextToken
    }
  }
`;

const makeRequest = async (query, operationName, variables) => {
  const req = new AWS.HttpRequest(appsyncUrl, region);

  req.method = 'POST';
  req.path = '/graphql';
  req.headers.host = endpoint;
  req.headers['Content-Type'] = 'application/json';
  req.body = JSON.stringify({
    query,
    operationName,
    variables,
  });

  const signer = new AWS.Signers.V4(req, 'appsync', true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return await new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      let data = '';

      result.on('data', (chunk) => {
        data += chunk;
      });

      result.on('end', () => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
};

const getAllUsers = async (token) => {
  const usersToProcess = await makeRequest(print(usersByStatus), 'UsersByStatus', {
    status: 'ACTIVE',
    filter: {
      receive_emails: { eq: true },
    },
    ...(token && { nextToken: token }),
  });

  if (usersToProcess && usersToProcess.data && usersToProcess.data.UsersByStatus) {
    if (usersToProcess.data.UsersByStatus.nextToken) {
      return usersToProcess.data.UsersByStatus.items.concat(
        await getAllUsers(usersToProcess.data.UsersByStatus.nextToken)
      );
    } else {
      return usersToProcess.data.UsersByStatus.items;
    }
  }
  return [];
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { main_announcement, secondary_announcement } = JSON.parse(event.body);

  const fromEmailAddress = await makeRequest(
    print(getConfigurationSettingByName),
    'GetConfigurationSettingByName',
    { name: 'system_email_address' }
  );

  const fromEmailAddressToUse = fromEmailAddress.data.getConfigurationSettingByName
    ? fromEmailAddress.data.getConfigurationSettingByName.items[0].value
    : 'donotreply@fisherhouse.org';

  const users = await getAllUsers('');

  let i,
    j,
    temporary,
    chunk = 5;
  let emailSendingData = {
    Source: fromEmailAddressToUse,
    Template: 'hotelsforheroes-AnnouncementEmailSESTemplate-' + process.env.ENV,
    DefaultTemplateData: JSON.stringify({
      name: 'friend',
      main_announcement,
      secondary_announcement,
    }),
  };

  for (i = 0, j = users.length; i < j; i += chunk) {
    temporary = users.slice(i, i + chunk);
    // do whatever
    emailSendingData.Destinations = temporary.map((item) => {
      const emailToUser =
        process.env.EMAIL_REWRITE_ENABLED == '1'
          ? item.username.replace('@', '-') + '@nastelo.com'
          : item.username;
      return {
        Destination: {
          ToAddresses: [emailToUser],
        },
        ReplacementTemplateData: JSON.stringify({ name: item.first_name + ' ' + item.last_name }),
      };
    });

    await ses.sendBulkTemplatedEmail(emailSendingData).promise();
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify('Emails sent.'),
  };
};
