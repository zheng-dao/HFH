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
  const body = JSON.parse(event.body);

  // Retrieve the email from the configuration settings.
  const fromEmailAddress = await makeRequest(
    print(getConfigurationSettingByName),
    'GetConfigurationSettingByName',
    { name: 'system_email_address' }
  );

  const fromEmailAddressToUse = fromEmailAddress.data.getConfigurationSettingByName
    ? fromEmailAddress.data.getConfigurationSettingByName.items[0].value
    : 'donotreply@fisherhouse.org';

  const messageTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Hotels for Heroes Application Assigned to You</title>
    </head>
    
    <body style="text-align: center;">
    
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="text-align: left; margin: 0 auto; max-width: 480px; font-size: 14pt;font-family: sans-serif; color: #333;">
      <tr>
        <td>
        <p style="text-align: left; margin: 4em 1em 1em 1em;">Dear ${body.given_name},</p>
          <p style="text-align: left; margin: 0 1em 3em 1em;">An application for ${body.service_member} (${body.initial_check_in} - ${body.final_check_out}) has been assigned to you by ${body.assigning_user} in the Hotels for Heroes system.</p>
          <p style="text-align: left; margin: 0 1em 3em 1em;"><a href="${body.application_link}">Click here</a> to view the application.</p>
          <p style="text-align: left; margin: 0 1em 3em 1em;">
          Thank you,<br/>
          Hotels for Heroes
          </p>
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

  var eParams = {
    Destination: {
      ToAddresses: [body.recipient],
    },
    Message: {
      Body: {
        Html: {
          Data: messageTemplate,
        },
      },
      Subject: {
        Data: 'Application for ' + body.service_member,
      },
    },

    Source: fromEmailAddressToUse,
  };

  const mailchimpClient = require('@mailchimp/mailchimp_transactional')(
    process.env.MAILCHIMP_API_KEY
  );

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
  // console.log("Email data is", eParams.Message.Body.Text)
  // await ses.sendEmail(eParams).promise();
  //callback(null, event)
  // console.log("EMAIL CODE END");

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify('Hello from Lambda!'),
  };
};
