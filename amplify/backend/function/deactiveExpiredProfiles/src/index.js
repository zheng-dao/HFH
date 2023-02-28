const https = require('https');
const AWS = require('aws-sdk');
const urlParse = require('url').URL;
const appsyncUrl = process.env.API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const updateUser = /* GraphQL */ gql`
  mutation UpdateUser($input: UpdateUserInput!, $condition: ModelUserConditionInput) {
    updateUser(input: $input, condition: $condition) {
      id
    }
  }
`;

const listUsers = /* GraphQL */ gql`
  query ListUsers($filter: ModelUserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
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

const getAllFilteredUsers = async (token) => {
  const results = await makeRequest(print(listUsers), 'ListUsers', {
    filter: {
      expiration_date: {
        le: new Date().toISOString(),
      },
      status: {
        eq: 'ACTIVE',
      },
    },
    limit: 999,
    nextToken: token,
  });
  let finalResults = [];

  if (results.data.listUsers.nextToken) {
    const moreResults = getAllFilteredUsers(results.data.listUsers.nextToken);
    finalResults = results.data.listUsers.items.concat(moreResults);
  } else {
    finalResults = results.data.listUsers.items;
  }
  return finalResults;
};

exports.handler = async (event) => {
  const eligibleUsers = await getAllFilteredUsers(null);
  let inactiveResult = null;
  if (eligibleUsers.length > 0) {
    for (const item of eligibleUsers) {
      console.log('Expiring profile ' + item.id);
      inactiveResult = await makeRequest(print(updateUser), 'UpdateUser', {
        input: {
          id: item.id,
          status: 'INACTIVE',
        },
      });
    }
  }

  console.log('Should have expired ' + eligibleUsers.length + ' user profiles.');

  return {
    statusCode: 200,
    body: JSON.stringify('Hello World'),
  };
};
