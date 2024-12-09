const { graphqlRequest } = require('../api/graphql/utils');
const {
  getLiquidationAddresses,
  getExternalAccounts,
} = require('../api/rest/bridge');

const EnvVarsConfig = require('../config/envVars.js');

const { getUser } = require('../api/graphql/schemas');

const getUserLiquidationAddressHandler = async (event) => {
  const { temp_liquidationAddressOverrides } = await EnvVarsConfig.getEnvVars();
  const userAddress = event.arguments.userAddress;

  try {
    const overrides = JSON.parse(temp_liquidationAddressOverrides);
    if (overrides[userAddress]) {
      return overrides[userAddress];
    }
  } catch (e) {
    console.log('Error parsing liquidation address overrides: ', e);
  }

  const { data: graphQlData } = await graphqlRequest(getUser, {
    id: userAddress,
  });
  const colonyUser = graphQlData?.getUser;

  const bridgeCustomerId = colonyUser?.bridgeCustomerId;
  if (!bridgeCustomerId) {
    return null;
  }

  const externalAccounts = await getExternalAccounts(bridgeCustomerId);
  const firstAccount = externalAccounts?.[0];

  if (!firstAccount) {
    return null;
  }

  const liquidationAddresses = await getLiquidationAddresses(bridgeCustomerId);

  const relevantLiquidationAddress = liquidationAddresses.find(
    (address) => address.external_account_id === firstAccount.id,
  )?.address;

  return relevantLiquidationAddress;
};

module.exports = {
  getUserLiquidationAddressHandler,
};
