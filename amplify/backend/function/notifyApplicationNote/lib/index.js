/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["MAILCHIMP_API_KEY"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
import gql from 'graphql-tag';
import * as graphql from 'graphql';
const { print } = graphql;
import mailchimp from '@mailchimp/mailchimp_transactional';
import aws from 'aws-sdk';
import { makeRequest } from '/opt/nodejs/makeRequest.js';

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

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

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
        <title>Hotels for Heroes Application</title>
        </head>
        
        <body style="text-align: center;">
        
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="text-align: left; margin: 0 auto; max-width: 480px; font-size: 14pt;font-family: sans-serif; color: #333;">
        <tr>
            <td>
            <p style="text-align: left; margin: 4em 1em 1em 1em;">Dear ${body.to},</p>
            <p style="text-align: left; margin: 0 1em 3em 1em;">A note was added to the application for ${
              body.service_member_name
            } (${body.stay_dates})</p>
            <p style="text-align: left; margin: 0 1em 3em 1em;">${body.name} said:</p>
            <p style="text-align: left; margin: 0 1em 3em 1em;"><i>${body.note.replace(
              /(?:\r\n|\r|\n)/g,
              '<br>'
            )}</i></p>
            <p style="text-align: left; margin: 0 1em 3em 1em;"><a href="${
              body.link
            }">Click here</a> to view this application.</p>
            <p style="text-align: left; margin: 0 1em 3em 1em;">
            Thank you,<br/>
            Hotels for Heroes
            </p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center;">
            <img style="width: 80%; height: auto;" src="https://resources.fisherhouse.org/v1.0.0/images/hfh_email.gif" />
            </td>
        </tr>
        </table>
        
        </body>
        
        </html>
        `;

  var eParams = {
    Destination: {
      ToAddresses: body.email,
    },
    Message: {
      Body: {
        Html: {
          Data: messageTemplate,
        },
      },
      Subject: {
        Data: body.type + ' Note Added for ' + body.service_member_name,
      },
    },

    Source: fromEmailAddressToUse,
  };

  const { Parameter } = await new aws.SSM()
    .getParameter({
      Name: process.env.MAILCHIMP_API_KEY,
      WithDecryption: true,
    })
    .promise();

  const mailchimpClient = mailchimp(Parameter.Value);

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

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify('User notified.'),
  };
};
