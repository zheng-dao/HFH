exports.handler = async (event) => {
  console.log('Trigger source', event.triggerSource);
  // Define the URL that you want the user to be directed to after verification is complete
  if (event.triggerSource === 'CustomMessage_SignUp') {
    const { codeParameter } = event.request;
    const { region, userName } = event;
    const { clientId } = event.callerContext;
    const redirectUrl = `${process.env.REDIRECTURL}?username=${userName}`;
    const resourcePrefix = process.env.RESOURCENAME.split('CustomMessage')[0];
    const { given_name } = event.request.userAttributes;

    const hyphenRegions = [
      'us-east-1',
      'us-west-1',
      'us-west-2',
      'ap-southeast-1',
      'ap-southeast-2',
      'ap-northeast-1',
      'eu-west-1',
      'sa-east-1',
    ];

    const seperator = hyphenRegions.includes(region) ? '-' : '.';

    const payload = Buffer.from(
      JSON.stringify({
        userName,
        redirectUrl,
        region,
        clientId,
      })
    ).toString('base64');
    const bucketUrl = `http://${resourcePrefix}verificationbucket-${process.env.ENV}.s3-website${seperator}${region}.amazonaws.com`;
    const url = `${bucketUrl}/?data=${payload}&code=${codeParameter}`;
    const messageTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${process.env.EMAILSUBJECT}</title>
    </head>
    
    <body style="text-align: center;">
    
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="text-align: left; margin: 0 auto; max-width: 480px; font-size: 14pt;font-family: sans-serif; color: #333;">
      <tr>
        <td>
        <p style="text-align: left; margin: 4em 1em 1em 1em;">Dear ${given_name},</p>
          <p style="text-align: left; margin: 0 1em 3em 1em;">Welcome to the Hotels for Heroes application system. Please click the link below to confirm your account\'s email address.</p>
          <p style="text-align: center; margin: 0 1em 3em 1em; padding: 1em; border: 1px solid #ccc; border-radius: 1em;"><a style="color: #004b8d;" href="${url}"><strong>Confirm Your Email Address</strong></a></p>
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
    const message = messageTemplate;
    event.response.smsMessage = message;
    event.response.emailSubject = process.env.EMAILSUBJECT;
    event.response.emailMessage = message;
    console.log('event.response', event.response);
  } else if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    const { codeParameter } = event.request;
    const { region, userName } = event;
    const { given_name, email } = event.request.userAttributes;
    console.log('Code is', codeParameter);
    const url =
      process.env.REDIRECTURL +
      'user/password?email=' +
      encodeURIComponent(email) +
      '&code=' +
      codeParameter;

    const messageTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${process.env.EMAILSUBJECT}</title>
    </head>
    
    <body style="text-align: center;">
    
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="text-align: left; margin: 0 auto; max-width: 480px; font-size: 14pt;font-family: sans-serif; color: #333;">
      <tr>
        <td>
        <p style="text-align: left; margin: 4em 1em 1em 1em;">Dear ${given_name},</p>
          <p style="text-align: left; margin: 0 1em 3em 1em;">Please click the link below to reset your account\'s password.</p>
          <p style="text-align: center; margin: 0 1em 3em 1em; padding: 1em; border: 1px solid #ccc; border-radius: 1em;"><a style="color: #004b8d;" href="${url}"><strong>Reset Your Password</strong></a></p>
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
    const message = messageTemplate;
    event.response.smsMessage = message;
    event.response.emailSubject = 'Hotels for Heroes Password Reset';
    event.response.emailMessage = message;
    console.log('event.response', event.response);
  } else if (
    event.triggerSource === 'CustomMessage_UpdateUserAttribute' ||
    event.triggerSource === 'CustomMessage_VerifyUserAttribute' ||
    event.triggerSource === 'CustomMessage_ResendCode'
  ) {
    const { codeParameter } = event.request;
    const { region, userName } = event;
    const { given_name, email } = event.request.userAttributes;
    console.log('Code is', codeParameter);
    const url =
      process.env.REDIRECTURL +
      'user/validate?email=' +
      encodeURIComponent(email) +
      '&code=' +
      codeParameter;

    const messageTemplate = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${process.env.EMAILSUBJECT}</title>
    </head>
    
    <body style="text-align: center;">
    
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="text-align: left; margin: 0 auto; max-width: 480px; font-size: 14pt;font-family: sans-serif; color: #333;">
      <tr>
        <td>
        <p style="text-align: left; margin: 4em 1em 1em 1em;">Dear ${given_name},</p>
          <p style="text-align: left; margin: 0 1em 3em 1em;">Please click the link below to verify your new email address.</p>
          <p style="text-align: center; margin: 0 1em 3em 1em; padding: 1em; border: 1px solid #ccc; border-radius: 1em;"><a style="color: #004b8d;" href="${url}"><strong>Verify Your Email</strong></a></p>
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
        <div style="background-color: #fff; padding 5px; border-radius: 5px;">
              <img style="width: 80%; height: auto; margin: 5px;" src="https://resources.fisherhouse.org/v1.0.0/images/hfh_email.gif" />
            </div>
        </td>
      </tr>
    </table>
    
    </body>
    
    </html>
    `;
    const message = messageTemplate;
    event.response.smsMessage = message;
    event.response.emailSubject = 'Hotels for Heroes Email Verification';
    event.response.emailMessage = message;
    console.log('event.response', event.response);
  }

  return event;
};
