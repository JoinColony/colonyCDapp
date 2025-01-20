require('cross-fetch/polyfill');
const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
  constants: { AddressZero },
} = require('ethers');

const { graphqlRequest } = require('./utils');
const { getColony } = require('./queries');

Logger.setLogLevel(Logger.levels.ERROR);

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let network = Network.Custom;
let networkAddress;

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [networkAddress, apiKey, graphqlURL, rpcURL, network] = await getParams([
      'networkContractAddress',
      'appsyncApiKey',
      'graphqlUrl',
      'chainRpcEndpoint',
      'chainNetwork',
    ]);
  } else {
    const {
      etherRouterAddress,
    } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
    networkAddress = etherRouterAddress;
  }
};

exports.handler = async ({ source: { id: colonyAddress } }) => {
  try {
    await setEnvVariables();

    const balances = [];

    const response = await graphqlRequest(
      getColony,
      { address: colonyAddress },
      graphqlURL,
      apiKey,
    );
    const { getColony: colony } = response?.data || {};

    if (!colony) {
      return { items: [] };
    }

    const provider = new providers.StaticJsonRpcProvider(rpcURL);
    const networkClient = getColonyNetworkClient(network, provider, {
      networkAddress,
      disableVersionCheck: true,
    });

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
  } catch (e) {
    console.error(e);
    return { items: [] };
  }
};
