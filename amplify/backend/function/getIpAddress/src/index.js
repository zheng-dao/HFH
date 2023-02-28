exports.handler = async (event) => {
  const requestIp = require('request-ip');

  // TODO implement
  const response = {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({ ip: requestIp.getClientIp(event) }),
  };
  return response;
};
