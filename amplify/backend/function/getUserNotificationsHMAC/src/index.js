const Base64 = require('crypto-js/enc-base64');
const hmacSHA256 = require('crypto-js/hmac-sha256');

let magicbellApiSecret = process.env.MAGICBELL_API_SECRET;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;

  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [magicbellApiSecret] = await getParams(['magicbellApiSecret']);
  }
};

exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (err) {
    throw new Error('Unable to set environment variables. Reason:', err);
  }

  const checksummedWalletAddress = event.request.headers['x-wallet-address'];

  if (!checksummedWalletAddress) {
    return undefined;
  }

  const userExternalIDHMAC = Base64.stringify(
    hmacSHA256(checksummedWalletAddress, magicbellApiSecret),
  );

  return userExternalIDHMAC;
};
