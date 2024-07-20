const { graphqlRequest } = require('../utils');
const { createExternalAccount } = require('./utils');

const { getUser } = require('../graphql');

const createExternalAccountHandler = async (
  event,
  { appSyncApiKey, apiKey, apiUrl, graphqlURL },
) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];
  const input = event.arguments?.input;

  const { data: graphQlData } = await graphqlRequest(
    getUser,
    {
      id: checksummedWalletAddress,
    },
    graphqlURL,
    appSyncApiKey,
  );

  const bridgeCustomerId = graphQlData?.getUser?.bridgeCustomerId;

  await createExternalAccount(apiUrl, apiKey, bridgeCustomerId, input);

  return {
    success: true,
  };
};

module.exports = {
  createExternalAccountHandler,
};
