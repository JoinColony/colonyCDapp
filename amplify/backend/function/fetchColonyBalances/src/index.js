require('cross-fetch/polyfill');
const {
  providers,
  utils: { Logger },
  constants: { AddressZero },
  Contract,
} = require('ethers');

const { graphqlRequest } = require('./utils');
const { getColony, getProxyColonies } = require('./queries');
const basicColonyAbi = require('./basicColonyAbi.json');
const basicUpdatedColonyAbi = require('./basicUpdatedColonyAbi.json');

const FIRST_COLONY_VERSION_WITH_PROXY_COLONIES = 18;

Logger.setLogLevel(Logger.levels.ERROR);

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL = 'http://network-contracts:8545';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL, rpcURL] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
      'chainRpcEndpoint',
    ]);
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

    // Fetch proxy colony details
    const getProxyColoniesResponse = await graphqlRequest(
      getProxyColonies,
      { colonyAddress },
      graphqlURL,
      apiKey,
    );

    if (getProxyColoniesResponse.errors || !getProxyColoniesResponse.data) {
      const [error] = getProxyColoniesResponse.errors;
      throw new Error(
        error?.message || 'Could not fetch proxy colony data from DynamoDB',
      );
    }

    const { items: proxyColonies } =
      getProxyColoniesResponse?.data?.getProxyColoniesByColonyAddress;

    const activeProxyColonies = proxyColonies.filter(
      (proxyColony) => proxyColony.isActive,
    );

    const provider = new providers.StaticJsonRpcProvider(rpcURL);

    const { version: colonyVersion } = colony;

    const colonyVersionSupportsProxies =
      colonyVersion >= FIRST_COLONY_VERSION_WITH_PROXY_COLONIES;

    const lightColonyClient = new Contract(
      colonyAddress,
      colonyVersionSupportsProxies ? basicUpdatedColonyAbi : basicColonyAbi,
      provider,
    );

    const { chainId } = colony?.chainMetadata || {};
    const { items: domains = [] } = colony.domains || {};
    const { items: tokens = [] } = colony.tokens || {};

    domains.map(async (domain) => {
      const { nativeId, nativeFundingPotId } = domain;

      // Native chain token. Ie: address 0x0000...0000
      balances.push(async () => {
        let rewardsPotTotal;
        if (colonyVersionSupportsProxies) {
          rewardsPotTotal = await lightColonyClient.getFundingPotBalance(
            nativeFundingPotId,
            chainId,
            AddressZero,
          );
        } else {
          rewardsPotTotal = await lightColonyClient.getFundingPotBalance(
            nativeFundingPotId,
            AddressZero,
          );
        }
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
            chainMetadata: {
              chainId,
            },
          },
          balance: rewardsPotTotal.toString(),
        };
      });

      const mainChainTokens = tokens.filter(
        (token) => token.token.chainMetadata.chainId === chainId,
      );

      mainChainTokens.map(async ({ token }) => {
        const { id: tokenAddress } = token;

        balances.push(async () => {
          let rewardsPotTotal;
          if (colonyVersionSupportsProxies) {
            rewardsPotTotal = await lightColonyClient.getFundingPotBalance(
              nativeFundingPotId,
              chainId,
              tokenAddress,
            );
          } else {
            rewardsPotTotal = await lightColonyClient.getFundingPotBalance(
              nativeFundingPotId,
              tokenAddress,
            );
          }
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

    if (!colonyVersionSupportsProxies) {
      return {
        items: await Promise.all(balances.map(async (resolve) => resolve())),
      };
    }

    activeProxyColonies.map(async (proxyColony) => {
      const proxyChainId = proxyColony.chainId;

      domains.map(async (domain) => {
        const { nativeId, nativeFundingPotId } = domain;

        // Native chain token. Ie: address 0x0000...0000
        balances.push(async () => {
          const rewardsPotTotal = await lightColonyClient.getFundingPotBalance(
            nativeFundingPotId,
            proxyChainId,
            AddressZero,
          );

          /*
           * We're using this patters so that we could parallelize all calls at once
           * since this is in essence a multi dimensional array (of async data)
           */
          return {
            id: `${proxyChainId}_${colonyAddress}_${nativeId}_${AddressZero}_balance`,
            domain,
            token: {
              ...tokens[0].token,
              id: AddressZero,
              name: '',
              symbol: '',
              decimals: 18,
              type: 'CHAIN_NATIVE',
              chainMetadata: {
                chainId: proxyChainId,
              },
            },
            balance: rewardsPotTotal.toString(),
          };
        });

        const proxyChainTokens = tokens.filter(
          (token) => token.token.chainMetadata.chainId === proxyChainId,
        );

        proxyChainTokens.map(async ({ token }) => {
          const { id: tokenAddress } = token;

          balances.push(async () => {
            const rewardsPotTotal =
              await lightColonyClient.getFundingPotBalance(
                nativeFundingPotId,
                proxyChainId,
                tokenAddress,
              );

            /*
             * We're using this patters so that we could parallelize all calls at once
             * since this is in essence a multi dimensional array (of async data)
             */
            return {
              id: `${proxyChainId}_${colonyAddress}_${nativeId}_${tokenAddress}_balance`,
              domain,
              token,
              balance: rewardsPotTotal.toString(),
            };
          });
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
