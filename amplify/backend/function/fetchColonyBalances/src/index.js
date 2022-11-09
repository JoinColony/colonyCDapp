/* eslint-disable camelcase */
const { Amplify, API, graphqlOperation } = require('aws-amplify');

const { getColony } = require('./queries');
const { sortDomainsByNativeId, sortTokensByCreationDate } = require('./utils');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002';
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

Amplify.configure({
  aws_appsync_graphqlEndpoint: `${GRAPHQL_URI}/graphql`,
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: API_KEY,
});

exports.handler = async ({ source: { id: colonyAddress } }) => {
  const balances = [];

  const {
    data: { getColony: colony },
  } = await API.graphql(
    graphqlOperation(getColony, { address: colonyAddress }),
  );

  // console.log(colony);

  if (colony) {
    const { chainId } = colony?.meta || {};
    const { items: domains = [] } = colony.domains || {};
    const { items: tokens = [] } = colony.tokens || {};

    await Promise.all(
      domains.sort(sortDomainsByNativeId).map(async (domain) => {
        const { nativeId } = domain;
        // do native chain token here
        tokens.sort(sortTokensByCreationDate).map(async ({ token }) => {
          const { id: tokenAddress } = token;
          balances.push({
            id: `${chainId}_${colonyAddress}_${nativeId}_${tokenAddress}_balance`,
            domain,
            token,
            balance: '0',
          });
        });
      }),
    );
    return {
      items: balances,
    };
  }
  return null;
};
