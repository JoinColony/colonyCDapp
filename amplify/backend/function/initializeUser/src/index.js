const { utils } = require('ethers');

const { graphqlRequest } = require('./utils');

const { getPendingTransactions, failTransaction } = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;

  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL] = await getParams(['appsyncApiKey', 'graphqlUrl']);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
    await setEnvVariables();
  } catch (e) {
    throw new Error('Unable to set environment variables. Reason:', e);
  }

  const { userAddress } = event.arguments?.input || {};

  let checksummedWalletAddress;
  try {
    checksummedWalletAddress = utils.getAddress(userAddress);
  } catch (error) {
    throw new Error("User's wallet address is not valid (after checksum)");
  }

  const authAddress = utils.getAddress(event.request.headers['x-wallet-address']);

  if (authAddress !== checksummedWalletAddress) {
    throw new Error(`Given user is not logged in`);
  }

  let nextToken;
  const promises = [];

  do {
    const result = await graphqlRequest(
      getPendingTransactions,
      { userAddress: checksummedWalletAddress, nextToken },
      graphqlURL,
      apiKey,
    );

    if (result.errors || !result.data) {
      const [error] = result.errors;
      throw new Error(
        error?.message || 'Could not fetch user data from DynamoDB',
      );
    }
    nextToken = result.data.getTransactionsByUser?.nextToken;

    Array.prototype.push.apply(
      promises,
      result.data.getTransactionsByUser?.items.filter((i) => (!!i)).map((tx) => {
        return graphqlRequest(
          failTransaction,
          { id: tx.id },
          graphqlURL,
          apiKey,
        );
      }),
    );
  } while (nextToken);

  const mutationResults = await Promise.allSettled(promises);
  const failedTransactions =  mutationResults.map((res) => res.data?.updateTransaction).filter((res) => !!res);

  return { failedTransactions };
};
