const QUEUE_URL_BASE = 'https://sqs.' + process.env.REGION + '.amazonaws.com/';
const QUEUE_NAME = 'export-csv-' + process.env.ENV;

const AWS = require('aws-sdk');
const SQS = new AWS.SQS();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const AWS_ACCOUNT_ID = event.requestContext.accountId;

  const QUEUE_URL = QUEUE_URL_BASE + AWS_ACCOUNT_ID + '/' + QUEUE_NAME;

  await SQS.sendMessage({
    MessageBody: event.body,
    QueueUrl: QUEUE_URL,
  }).promise();

  return {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify('Queued export.'),
  };
};
