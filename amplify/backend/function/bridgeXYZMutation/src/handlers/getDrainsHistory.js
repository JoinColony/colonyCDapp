const fetch = require('cross-fetch');
const { graphqlRequest } = require('../api/graphql/utils');
const { getUser } = require('../api/graphql/schemas');
const {
  getLiquidationAddresses,
  getDrainsHistory,
} = require('../api/rest/bridge');

const getDrainsHistoryHandler = async (event) => {
  const checksummedWalletAddress = event.request.headers['x-wallet-address'];

  const { data: graphQlData } = await graphqlRequest(getUser, {
    id: checksummedWalletAddress,
  });
  const colonyUser = graphQlData?.getUser;

  const bridgeCustomerId = colonyUser?.bridgeCustomerId;

  const liquidationAddresses = await getLiquidationAddresses(bridgeCustomerId);

  if (!liquidationAddresses.length) {
    return [];
  }

  const liquidationAddressIds = liquidationAddresses.map((item) => item.id);

  const drains = [];

  for (const liquidationAddressId of liquidationAddressIds) {
    const drainsResult = await getDrainsHistory(
      bridgeCustomerId,
      liquidationAddressId,
    );

    const mappedDrains = drainsResult.data.map((drain) => ({
      id: drain.id,
      amount: drain.amount,
      currency: drain.currency,
      state: drain.state,
      createdAt: drain.created_at,
      receipt: drain.receipt
        ? {
            url: drain.receipt.url,
          }
        : null,
    }));

    drains.push(...mappedDrains);
  }

  return drains;
};

module.exports = {
  getDrainsHistoryHandler,
};
