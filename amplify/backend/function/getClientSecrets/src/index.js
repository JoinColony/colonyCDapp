let pinataApiSecret = process.env.PINATA_API_SECRET;
let coinGeckoApiKey = process.env.COINGECKO_API_KEY;
let arbiscanApiKey = process.env.ARBISCAN_API_KEY;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;

  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [pinataApiSecret, coinGeckoApiKey, arbiscanApiKey] = await getParams([
      'pinataApiSecret',
      'coinGeckoApiKey',
      'arbiscanApiKey',
    ]);
  }
};

exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (err) {
    throw new Error('Unable to set environment variables. Reason:', err);
  }

  if (!event.request.headers['x-wallet-address']) {
    return null;
  }

  return {
    pinataApiSecret,
    coinGeckoApiKey,
    arbiscanApiKey,
  };
};
