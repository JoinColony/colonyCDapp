const { graphqlRequest } = require('../utils');
const { getLiquidationAddresses, getExternalAccounts } = require('./utils');

const { getUser } = require('../graphql');

const getUserLiquidationAddressHandler = async (
  event,
  {
    appSyncApiKey,
    apiKey,
    apiUrl,
    graphqlURL,
    temp_liquidationAddressOverrides,
  },
) => {
  const userAddress = event.arguments.userAddress;

  try {
    const overrides = JSON.parse(temp_liquidationAddressOverrides);
    if (overrides[userAddress]) {
      return overrides[userAddress];
    }
  } catch (e) {
    console.log('Error parsing liquidation address overrides: ', e);
  }

  const { data: graphQlData } = await graphqlRequest(
    getUser,
    {
      id: userAddress,
    },
    graphqlURL,
    appSyncApiKey,
  );
  const colonyUser = graphQlData?.getUser;

  const bridgeCustomerId = colonyUser?.bridgeCustomerId;
  if (!bridgeCustomerId) {
    return null;
  }

  const externalAccounts = await getExternalAccounts(
    apiUrl,
    apiKey,
    bridgeCustomerId,
  );
  const firstAccount = externalAccounts?.[0];

  if (!firstAccount) {
    return null;
  }

  const liquidationAddresses = await getLiquidationAddresses(
    apiUrl,
    apiKey,
    bridgeCustomerId,
  );

  const relevantLiquidationAddress = liquidationAddresses.find(
    (address) => address.external_account_id === firstAccount.id,
  )?.address;

  return relevantLiquidationAddress;
};

module.exports = {
  getUserLiquidationAddressHandler,
};
