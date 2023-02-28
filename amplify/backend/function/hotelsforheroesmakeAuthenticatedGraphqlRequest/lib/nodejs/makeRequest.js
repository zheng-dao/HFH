// import https from 'https';
// import AWS from 'aws-sdk';
// import url from 'url';
const https = require('https');
const AWS = require('aws-sdk');
const url = require('url');
const urlParse = url.URL;
const appsyncUrl = process.env.API_HOTELSFORHEROES_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();

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

exports.makeRequest = makeRequest;
