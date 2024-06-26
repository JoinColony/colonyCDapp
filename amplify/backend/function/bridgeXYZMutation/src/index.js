const fetch = require('cross-fetch');

const AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN;
const ENV = process.env.ENV;

const bridgeBasePath = 'http://mocking:3000/bridgexyz';

exports.handler = async (event) => {
  const { body, path, pathParams } = event.arguments?.input || {};

  console.log('Here ');

  const kycLinkHandler = async () => {
    console.log('Running kycLinkHandler');
    try {
      const parsedBody = JSON.parse(body);

      const bodyToSend = {
        ...parsedBody,
        type: 'individual',
      };

      const res = await fetch(`${bridgeBasePath}/${path}`, {
        headers: {
          'Idempotency-Key': 'thisisadifferentkey',
          'Api-Key': 'thisisakey',
        },
        body: bodyToSend,
        method: 'POST',
      });

      console.log(await res.text());

      if (!data.customer_id) {
        throw new Error('No customer_id returned');
      } else {
      }
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  return (handler = {
    'v0/kyc_links': kycLinkHandler,
    default: () => {
      console.log('Running default handler');
      return null;
    },
  }[path || 'default']());
};
