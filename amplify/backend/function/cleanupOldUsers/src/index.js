/* Amplify Params - DO NOT EDIT
	API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIIDOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIKEYOUTPUT
	AUTH_HOTELSFORHEROES_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

const TableName =
  'User-' + process.env.API_HOTELSFORHEROES_GRAPHQLAPIIDOUTPUT + '-' + process.env.ENV;
const UserPoolId = process.env.AUTH_HOTELSFORHEROES_USERPOOLID;

const getAllFilteredUsers = async (token) => {
  const params = {
    TableName,
    IndexName: 'byStatus',
    KeyConditionExpression: '#kn0 = :kv0',
    ExpressionAttributeValues: {
      ':kv0': 'DRAFT',
    },
    ExpressionAttributeNames: {
      '#kn0': 'status',
    },
  };

  const results = await documentClient.query(params).promise();
  return results;
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const allUsers = await getAllFilteredUsers();

  const oldestDate = Date.now() - process.env.STALE_PROFILE_DURATION * 86400 * 1000;

  if (allUsers.Count > 0) {
    const usersToProcess = allUsers.Items.filter((item) => {
      return new Date(item.createdAt).getTime() <= oldestDate;
    });
    const allDeleteObjects = usersToProcess.map((item) => {
      return {
        DeleteRequest: {
          Key: {
            id: item.id,
          },
        },
      };
    });
    const allUsernamesForCognito = usersToProcess.map((item) => {
      return item.owner;
    });

    const chunkSize = 5;
    for (let i = 0; i < allDeleteObjects.length; i += chunkSize) {
      const chunk = allDeleteObjects.slice(i, i + chunkSize);
      const fullDeleteBatchWriteRequest = {
        RequestItems: {
          [TableName]: chunk,
        },
      };
      const res = await documentClient.batchWrite(fullDeleteBatchWriteRequest).promise();
      console.log('Result is', res);
    }
    for (const cognitoUser of allUsernamesForCognito) {
      const res = await cognitoidentityserviceprovider
        .adminDeleteUser({
          UserPoolId,
          Username: cognitoUser,
        })
        .promise();
      console.log('User delete request result', res);
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
