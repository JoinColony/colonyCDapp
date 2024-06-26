const fetch = require('cross-fetch');
const { graphqlRequest } = require('./utils');

let apiKey = 'da2-fakeApiId123456';
let apiUrl = 'http://mocking:3000/bridgexyz';
let graphqlURL = 'http://localhost:20002/graphql';

/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { updateUser } = require('./graphql');

const setEnvVariables = async () => {
  const ENV = process.env.ENV;

  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, apiUrl, graphqlURL] = await getParams([
      'bridgeXYZApiKey',
      'bridgeXYZApiUrl',
      'graphqlUrl',
    ]);
  }
};

exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const checksummedWalletAddress = event.request.headers['x-wallet-address'];
  const { body, path, pathParams } = event.arguments?.input || {};

  const kycLinkHandler = async () => {
    try {
      const parsedBody = JSON.parse(body);

      const bodyToSend = {
        ...parsedBody,
        type: 'individual',
      };

      const res = await fetch(`${apiUrl}/${path}`, {
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': 'thisisadifferentkey',
          'Api-Key': apiKey,
        },
        body: JSON.stringify(bodyToSend),
        method: 'POST',
      });

      const data = await res.json();

      if (!data.customer_id) {
        throw new Error('No customer_id returned');
      } else {
        console.log('checksummedWalletAddress is: ', checksummedWalletAddress);

        // Add customer_id to the user object
        const mutation = await graphqlRequest(
          updateUser,
          {
            input: {
              id: checksummedWalletAddress,
              bridgeCustomerId: data.customer_id,
            },
          },
          graphqlURL,
          apiKey,
        );

        if (mutation.errors || !mutation.data) {
          const [error] = mutation.errors;
          throw new Error(
            error?.message ||
              `Could not update user with wallet address "${checksummedWalletAddress}"`,
          );
        }

        // Return the two urls
        return {
          tos_link: data.tos_link,
          kyc_link: data.kyc_link,
        };
      }
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  const handlers = {
    'v0/kyc_links': kycLinkHandler,
    default: () => {
      console.log('Running default handler');
      return null;
    },
  };

  const handler = handlers[path] || handlers.default;

  return handler();
};
