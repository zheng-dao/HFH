"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var graphql = _interopRequireWildcard(require("graphql"));

var _mailchimp_transactional = _interopRequireDefault(require("@mailchimp/mailchimp_transactional"));

var _makeRequest = require("/opt/nodejs/makeRequest.js");

var _adminPdf = _interopRequireDefault(require("./adminPdf.js"));

var _liaisonPdf = _interopRequireDefault(require("./liaisonPdf.js"));

var _itineraryPdf = _interopRequireDefault(require("./itineraryPdf.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Amplify Params - DO NOT EDIT
	API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIIDOUTPUT
	API_HOTELSFORHEROES_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const {
  print
} = graphql;
const getConfigurationSettingByName =
/* GraphQL */
(0, _graphqlTag.default)`
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

const handler = async event => {
  // Expected input: Recipient emails (array), body message addition, files
  // console.log(`EVENT: ${JSON.stringify(event)}`);
  const body = JSON.parse(event.body); // Retrieve the email from the configuration settings.

  const fromEmailAddress = await (0, _makeRequest.makeRequest)(print(getConfigurationSettingByName), 'GetConfigurationSettingByName', {
    name: 'system_email_address'
  });
  const fromEmailAddressToUse = fromEmailAddress.data.getConfigurationSettingByName ? fromEmailAddress.data.getConfigurationSettingByName.items[0].value : 'donotreply@fisherhouse.org';
  const mailchimpClient = (0, _mailchimp_transactional.default)(process.env.MAILCHIMP_API_KEY);
  let attachments = [];

  for (const am of body.attachments) {
    const amSplit = am.split('|');

    switch (amSplit[0]) {
      case 'liaison':
        const liaisonPdfString = await (0, _liaisonPdf.default)({
          application: body.application,
          applicant: body.applicant
        });
        attachments.push({
          type: 'application/pdf',
          name: 'liaison-' + body.application.id + '-' + Date.now() + '.pdf',
          content: liaisonPdfString
        });
        break;

      case 'admin':
        const adminPdfString = await (0, _adminPdf.default)({
          application: body.application,
          applicant: body.applicant
        });
        attachments.push({
          type: 'application/pdf',
          name: 'admin-' + body.application.id + '-' + Date.now() + '.pdf',
          content: adminPdfString
        });
        break;

      case 'itinerary':
        const itineraryPdfString = await (0, _itineraryPdf.default)({
          application: body.application,
          applicant: body.applicant,
          stay: body.stays.filter(item => item.id == amSplit[1])
        });
        attachments.push({
          type: 'application/pdf',
          name: 'itinerary-' + body.application.id + '-' + Date.now() + '.pdf',
          content: itineraryPdfString
        });
        break;
    }
  }

  const email_subject = attachments.length > 1 ? 'File Attachments for ' + body.service_member_name + ' (' + body.initial_check_in + ' - ' + body.final_check_out + ')' : attachments[0].name;

  for (const email of body.emails) {
    const message = {
      html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>${email_subject}</title>
        </head>
        
        <body style="text-align: center;">
        
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="text-align: left; margin: 0 auto; max-width: 480px; font-size: 14pt;font-family: sans-serif; color: #333;">
          <tr>
            <td>
              <p style="text-align: left; margin: 4em 1em 1em 1em;">${body.message}</p>
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
      `,
      subject: email_subject,
      from_email: fromEmailAddressToUse,
      from_name: 'Hotels for Heroes',
      attachments,
      to: [{
        email: email
      }]
    };
    const res = await mailchimpClient.messages.send({
      message
    });
    console.log('Res is', res);
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    },
    body: JSON.stringify('Hello from Fisher House!')
  };
};

exports.handler = handler;