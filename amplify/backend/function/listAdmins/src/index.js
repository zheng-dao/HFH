/* Amplify Params - DO NOT EDIT
	AUTH_HOTELSFORHEROES_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const { CognitoIdentityServiceProvider } = require('aws-sdk');

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const userPoolId = process.env.AUTH_HOTELSFORHEROES_USERPOOLID;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const getAllUsersInGroup = async (NextToken) => {
    const Limit = 60;
    const params = {
      GroupName: 'Administrators',
      UserPoolId: userPoolId,
      ...(Limit && { Limit }),
      ...(NextToken && { NextToken }),
    };

    const results = await cognitoIdentityServiceProvider.listUsersInGroup(params).promise();

    let finalResults = [];
    if (results.NextToken && results.NextToken.length > 0) {
      const moreResults = await getAllUsersInGroup(results.NextToken);
      finalResults = results.Users.concat(moreResults);
    } else {
      finalResults = results.Users;
    }
    return finalResults;
  };

  const allUsers = await getAllUsersInGroup(null);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(allUsers.map((item) => item.Username)),
  };
};
