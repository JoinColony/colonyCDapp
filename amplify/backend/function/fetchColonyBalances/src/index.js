const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
  constants: { AddressZero },
} = require('ethers');

const { graphqlRequest } = require('./utils');
const { getColony } = require('./queries');

const {
  etherRouterAddress: networkAddress,
} = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

Logger.setLogLevel(Logger.levels.ERROR);

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

const provider = new providers.JsonRpcProvider(RPC_URL);

exports.handler = async ({ source: { id: colonyAddress } }) => {
  const balances = [];

  const {
    data: { getColony: colony },
  } = await graphqlRequest(
    getColony,
    { address: colonyAddress },
    GRAPHQL_URI,
    API_KEY,
  );

  if (colony) {
    const networkClient = await getColonyNetworkClient(
      Network.Custom,
      provider,
      { networkAddress },
    );

    const colonyClient = await networkClient.getColonyClient(colonyAddress);

    const { chainId } = colony?.chainMetadata || {};
    const { items: domains = [] } = colony.domains || {};
    const { items: tokens = [] } = colony.tokens || {};

    domains.map(async (domain) => {
      const { nativeId, nativeFundingPotId } = domain;

      // Native chain token. Ie: address 0x0000...0000
      balances.push(async () => {
        const rewardsPotTotal = await colonyClient.getFundingPotBalance(
          nativeFundingPotId,
          AddressZero,
        );
        /*
         * We're using this patters so that we could parallelize all calls at once
         * since this is in essence a multi dimensional array (of async data)
         */
        return {
          id: `${chainId}_${colonyAddress}_${nativeId}_${AddressZero}_balance`,
          domain,
          token: {
            ...tokens[0].token,
            id: AddressZero,
            name: '',
            symbol: '',
            decimals: 18,
            type: 'CHAIN_NATIVE',
          },
          balance: rewardsPotTotal.toString(),
        };
      });

      tokens.map(async ({ token }) => {
        const { id: tokenAddress } = token;

        balances.push(async () => {
          const rewardsPotTotal = await colonyClient.getFundingPotBalance(
            nativeFundingPotId,
            tokenAddress,
          );
          /*
           * We're using this patters so that we could parallelize all calls at once
           * since this is in essence a multi dimensional array (of async data)
           */
          return {
            id: `${chainId}_${colonyAddress}_${nativeId}_${tokenAddress}_balance`,
            domain,
            token,
            balance: rewardsPotTotal.toString(),
          };
        });
      });
    });

    return {
      items: await Promise.all(balances.map(async (resolve) => resolve())),
    };
  }
  return null;
};
