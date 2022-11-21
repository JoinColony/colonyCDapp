/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const { providers } = require('ethers');

const { graphqlRequest } = require('./utils');

const {
  etherRouterAddress: networkAddress,
  // eslint-disable-next-line global-require
} = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { getUser } = require('./graphql');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

const ROOT_DOMAIN_ID = 1; // this used to be exported from @colony/colony-js but isn't anymore
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
const REPUTATION_ENDPOINT = 'http://localhost:3001/reputation';

exports.handler = async (event) => {
  const input = event?.arguments?.input;
  const colonyAddress = input?.colonyAddress;
  const domainId = input?.domainId;

  const provider = new providers.JsonRpcProvider(RPC_URL);

  const networkClient = getColonyNetworkClient(Network.Custom, provider, {
    networkAddress,
    reputationOracleEndpoint: REPUTATION_ENDPOINT,
  });
  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  const { skillId } = await colonyClient.getDomain(domainId ?? ROOT_DOMAIN_ID);
  const { addresses } = await colonyClient.getMembersReputation(skillId);
  console.log(`🚀 ~ exports.handler= ~ addresses`, addresses);

  // test user addresses (its unknown if they have reputation in the colony)
  // const addresses = [
  //   '0x9dF24e73f40b2a911Eb254A8825103723E13209C',
  //   '0x27fF0C145E191C22C75cD123C679C3e1F58a4469',
  //   '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
  // ];

  // get user for each address
  const members = await Promise.all(
    addresses.map(async (address) => {
      const { data } = await graphqlRequest(
        getUser,
        {
          id: address,
        },
        GRAPHQL_URI,
        API_KEY,
      );
      return data?.getUserByAddress?.items[0] || {};
    }),
  );
  console.log(`🚀 ~ exports.handler= ~ members`, members);
  return members || [];
};
