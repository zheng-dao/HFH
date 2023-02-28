/* Amplify Params - DO NOT EDIT
	API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIIDOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
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
var ses = new AWS.SES({ region: 'us-east-1' });

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

const getApplication = /* GraphQL */ gql`
  query GetApplication($id: ID!) {
    getApplication(id: $id) {
      id
      User {
        id
        username
        first_name
      }
      AssignedTo {
        id
        username
        first_name
      }
      ServiceMember {
        id
        first_name
        last_name
      }
    }
  }
`;

const updateStay = /* GraphQL */ gql`
  mutation UpdateStay($input: UpdateStayInput!) {
    updateStay(input: $input) {
      id
    }
  }
`;

const updateApplication = /* GraphQL */ gql`
  mutation UpdateApplication($input: UpdateApplicationInput!) {
    updateApplication(input: $input) {
      id
    }
  }
`;

const stayByNotificationAfterCheckout = /* GraphQL */ gql`
  query StayByNotificationAfterCheckout(
    $notified_about_checkout: Int!
    $status: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStayFilterInput
    $limit: Int
    $nextToken: String
  ) {
    stayByNotificationAfterCheckout(
      notified_about_checkout: $notified_about_checkout
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        applicationID
        actual_check_out
        requested_check_out
        Application {
          id
          User {
            id
            username
            first_name
          }
          AssignedTo {
            id
            username
            first_name
          }
          ServiceMember {
            id
            first_name
            last_name
          }
        }
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

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const waitTimeResult = await makeRequest(
    print(getConfigurationSettingByName),
    'GetConfigurationSettingByName',
    { name: 'days_after_checkout_alert' }
  );

  const daysAfterCheckin = waitTimeResult.data.getConfigurationSettingByName.items[0].value || 0;

  const fromEmailAddress = await makeRequest(
    print(getConfigurationSettingByName),
    'GetConfigurationSettingByName',
    { name: 'system_email_address' }
  );

  const fromEmailAddressToUse =
    fromEmailAddress.data.getConfigurationSettingByName.items[0].value ||
    'donotreply@fisherhouse.org';

  const mailchimpClient = require('@mailchimp/mailchimp_transactional')(
    process.env.MAILCHIMP_API_KEY
  );

  if (daysAfterCheckin > 0) {
    const staysToCheck = await makeRequest(
      print(stayByNotificationAfterCheckout),
      'StayByNotificationAfterCheckout',
      {
        notified_about_checkout: 0,
        status: { eq: 'APPROVED' },
      }
    );

    const dateDiff = daysAfterCheckin * 86400;

    for (const stay of staysToCheck.data.stayByNotificationAfterCheckout.items) {
      if (stay.requested_check_out) {
        const checkout_date = new Date(stay.requested_check_out);
        const today = new Date();
        if (today.getTime() - checkout_date.getTime() <= dateDiff) {
          // We haven't passed the requisite number of days yet. Carry on.
          continue;
        }
        const applicationResult = await makeRequest(print(getApplication), 'GetApplication', {
          id: stay.applicationID,
        });
        if (applicationResult.data.getApplication) {
          const { User, AssignedTo, ServiceMember, id } = applicationResult.data.getApplication;
          const url = process.env.REDIRECTURL + 'application/' + id;
          let recipient_user = {};
          let unread_field = '';

          if (User == null) {
            recipient_user = AssignedTo;
            unread_field = 'admin_read';
          } else {
            recipient_user = User;
            unread_field = 'liaison_read';
          }

          const email = recipient_user?.username;

          if (email) {
            const sm_first_name = ServiceMember?.first_name ?? 'Unknown';
            const sm_last_name = ServiceMember?.last_name ?? 'Unknown';

            const messageTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

                    <html xmlns="http://www.w3.org/1999/xhtml">
                    <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <title>Information Needed For Hotels For Heroes Stay</title>
                    </head>
                    
                    <body style="text-align: center;">
                    
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="text-align: left; margin: 0 auto; max-width: 480px; font-size: 14pt;font-family: sans-serif; color: #333;">
                        <tr>
                        <td>
                        <p style="text-align: left; margin: 4em 1em 1em 1em;">Dear ${recipient_user?.first_name},</p>
                            <p style="text-align: left; margin: 0 1em 3em 1em;">The anticipated checkout date for service member ${sm_first_name} ${sm_last_name}'s requested stay has passed. Please review and complete the stay information here: </p>
                            <p style="text-align: center; margin: 0 1em 3em 1em; padding: 1em; border: 1px solid #ccc; border-radius: 1em;"><a style="color: #004b8d;" href="${url}"><strong>Complete Stay</strong></a></p>
                        </td>
                        </tr>
                        <tr>
                        <td style="text-align: center;">
                            <img style="width: 80%; height: auto;" src="${process.env.REDIRECTURL}img/hfh_email.gif" />
                        </td>
                        </tr>
                    </table>
                    
                    </body>
                    
                    </html>
                    `;

            const eParams = {
              Destination: {
                ToAddresses: [email],
                // ToAddresses: ['brian@nastelo.com'],
                BccAddresses: ['brian@nastelo.com'],
                //ToAddresses: ['brian@nastelo.com']
              },
              Message: {
                Body: {
                  Html: {
                    Data: messageTemplate,
                  },
                },
                Subject: {
                  Data: 'Information Needed For Hotels For Heroes Stay',
                },
              },

              Source: fromEmailAddressToUse,
            };

            const message = {
              html: eParams.Message.Body.Html.Data,
              subject: eParams.Message.Subject.Data,
              from_email: eParams.Source,
              from_name: 'Hotels for Heroes',
              to: eParams.Destination.ToAddresses.map((item) => {
                return { email: item };
              }),
            };
            const res = await mailchimpClient.messages.send({ message });
            console.log('Res is', res);
            // await ses.sendEmail(eParams).promise();
            await makeRequest(print(updateApplication), 'UpdateApplication', {
              input: { id: stay.applicationID, [unread_field]: 'UNREAD' },
            });
          }
        }
      }

      // No matter what, update the stay.
      await makeRequest(print(updateStay), 'UpdateStay', {
        input: { id: stay.id, notified_about_checkout: 1 },
      });
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
