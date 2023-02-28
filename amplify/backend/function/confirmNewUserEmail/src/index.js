/* Amplify Params - DO NOT EDIT
	API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIIDOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIKEYOUTPUT
	AUTH_HOTELSFORHEROES_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const aws = require('aws-sdk');
const cognito = new aws.CognitoIdentityServiceProvider();
const UserPoolId = process.env.AUTH_HOTELSFORHEROES_USERPOOLID;
const { makeRequest } = require('/opt/nodejs/makeRequest.js');
const gql = require('graphql-tag');
const { print } = require('graphql');
const requestIp = require('request-ip');

const searchUsers = /* GraphQL */ gql`
  query SearchUsers(
    $filter: SearchableUserFilterInput
    $sort: [SearchableUserSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableUserAggregationInput]
  ) {
    searchUsers(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        username
        owner
      }
    }
  }
`;

const updateUser = /* GraphQL */ gql`
  mutation UpdateUser($input: UpdateUserInput!, $condition: ModelUserConditionInput) {
    updateUser(input: $input, condition: $condition) {
      id
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const body = JSON.parse(event.body);

  try {
    // Get user based on access token
    const user = await cognito
      .getUser({
        AccessToken: body.token,
      })
      .promise();

    console.log('User is', user);

    if (!user) {
      return {
        statusCode: 400,
        //  Uncomment below to enable CORS requests
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify('Unable to find user'),
      };
    }

    const verifyResult = await cognito
      .verifyUserAttribute({
        AccessToken: body.token,
        AttributeName: 'email',
        Code: body.code,
      })
      .promise();

    console.log('Verification result is', verifyResult);

    // Reload the user so we know what the new email is
    const updatedUser = await cognito
      .getUser({
        AccessToken: body.token,
      })
      .promise();

    console.log('Updated user is', updatedUser);

    // Find application
    const profiles = await makeRequest(print(searchUsers), 'SearchUsers', {
      filter: { username: { eq: body.email } },
    });

    if (
      !profiles?.data ||
      !profiles?.data?.searchUsers ||
      !profiles?.data?.searchUsers?.items ||
      profiles.data.searchUsers.items.length < 1
    ) {
      return {
        statusCode: 400,
        //  Uncomment below to enable CORS requests
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify('Unable to locate profile to change your contact email address.'),
      };
    }

    const profile = profiles?.data?.searchUsers.items.pop();

    console.log('Profile is', profile);
    const newEmail = updatedUser.UserAttributes.find((item) => item.Name == 'email').Value;
    // Update application.
    const updatedProfile = await makeRequest(print(updateUser), 'UpdateUser', {
      input: { id: profile.id, username: newEmail, pending_email: '' },
    });
    console.log('Update profile response is', updatedProfile);
  } catch (err) {
    console.log('Error is', err);
    return {
      statusCode: 400,
      //  Uncomment below to enable CORS requests
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify('This confirmation link is no longer valid. Your email is unchanged.'),
    };
  }

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify('Hello from Lambda!'),
  };
};
