const fetch = require('cross-fetch');
const { graphqlRequest } = require('../utils');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getUserByAddress } = require('../graphql');

let appSyncApiKey = 'da2-fakeApiId123456';
let apiKey = 'da2-fakeApiId123456';
let apiUrl = 'http://mocking:3000/bridgexyz';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;

  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [appSyncApiKey, apiKey, apiUrl, graphqlURL] = await getParams([
      'appsyncApiKey',
      'bridgeXYZApiKey',
      'bridgeXYZApiUrl',
      'graphqlUrl',
    ]);
  }
};

const putCustomerHandler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const checksummedWalletAddress = event.request.headers['x-wallet-address'];
  const { body, path } = event.arguments?.input || {};

  try {
    const { data: graphQlData } = await graphqlRequest(
      getUserByAddress,
      {
        id: checksummedWalletAddress,
      },
      graphqlURL,
      appSyncApiKey,
    );

    const bridgeCustomerId = graphQlData?.getUser?.bridgeCustomerId;

    const res = await fetch(
      `${apiUrl}/${path.replace('{customerID}', bridgeCustomerId)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': 'thisisadifferentkey',
          'Api-Key': apiKey,
        },
        body: JSON.stringify({
          ...body,
          type: 'individual',
        }),
        method: 'PUT',
      },
    );

    if (res.status !== 200) {
      throw Error(`Put failed with error code ${res.status}`);
    }

    return { success: true };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

module.exports = {
  putCustomerHandler,
};
