const { graphqlRequest } = require('../api/graphql/utils');
const { createExternalAccount } = require('../api/rest/bridge');

const { getUser } = require('../api/graphql/schemas');

const createExternalAccountHandler = async (event) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];
  const input = event.arguments?.input;

  const { data: graphQlData } = await graphqlRequest(getUser, {
    id: checksummedWalletAddress,
  });

  const bridgeCustomerId = graphQlData?.getUser?.bridgeCustomerId;

  await createExternalAccount(bridgeCustomerId, input);

  return {
    success: true,
  };
};

module.exports = {
  createExternalAccountHandler,
};
