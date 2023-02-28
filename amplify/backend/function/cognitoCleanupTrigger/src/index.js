/* Amplify Params - DO NOT EDIT
	API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIIDOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIKEYOUTPUT
	AUTH_HOTELSFORHEROES_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
const TableName =
  'User-' + process.env.API_HOTELSFORHEROES_GRAPHQLAPIIDOUTPUT + '-' + process.env.ENV;
const documentClient = new AWS.DynamoDB.DocumentClient();

const getAllCognitoUsers = async (token) => {
  let users = [];
  const response = await cognitoidentityserviceprovider
    .listUsers({
      UserPoolId: process.env.AUTH_HOTELSFORHEROES_USERPOOLID,
      PaginationToken: token,
    })
    .promise();
  users = response.Users;
  if (response.PaginationToken) {
    let additionalUsers = await getAllCognitoUsers(response.PaginationToken);
    return users.concat(additionalUsers);
  } else {
    return users;
  }
};

const getAllDynamoUsers = async (token) => {
  const params = {
    TableName,
    AttributesToGet: ['username'],
  };

  const results = await documentClient.scan(params).promise();
  return results.Items;
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const allUsers = await getAllCognitoUsers(null);
  const allDynamoUsers = await getAllDynamoUsers(null);
  const nakedDynamoUsers = allDynamoUsers.map((item) => item.username);
  const oldestDate = Date.now() - process.env.STALE_PROFILE_DURATION * 86400 * 1000;
  for (const user of allUsers) {
    const attributes = user.Attributes;
    const email = attributes.filter((item) => item.Name == 'email')[0].Value;
    if (email) {
      if (nakedDynamoUsers.includes(email)) {
        continue;
      } else {
        // Evaluate
        const userCreationDate = new Date(user.UserCreateDate).getTime();
        if (userCreationDate < oldestDate) {
          console.log('Deleting user ', user);
          const result = await cognitoidentityserviceprovider
            .adminDeleteUser({
              UserPoolId: process.env.AUTH_HOTELSFORHEROES_USERPOOLID,
              Username: user.Username,
            })
            .promise();
          console.log('Deletion result', result);
        }
      }
    }
  }
  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    body: JSON.stringify('Hello from Lambda!'),
  };
};
