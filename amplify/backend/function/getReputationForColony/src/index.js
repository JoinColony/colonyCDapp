/**
 * @type {import('aws-lambda').APIGatewayProxyHandler}
 */
const { Decimal } = require('decimal.js');
const { utils } = require('ethers');
const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const {
  providers,
  utils: { Logger },
} = require('ethers');

Logger.setLogLevel(Logger.levels.ERROR);

const { calculatePercentageReputation } = require('./reputation');
const { graphqlRequest } = require('./utils');
const { getUser } = require('./graphql');

/*
 * @TODO These values need to be imported properly, and differentiate based on environment
 */
const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI = 'http://localhost:20002/graphql';

const ROOT_DOMAIN_ID = 1; // this used to be exported from @colony/colony-js but isn't anymore
const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
const REPUTATION_ENDPOINT = 'http://network-contracts:3002';

const ZERO = '0';
const NEARZERO = '~0';

exports.handler = async (event) => {
  const { colonyAddress, domainId, rootHash } = event?.arguments?.input || {};
  const provider = new providers.JsonRpcProvider(RPC_URL);

  const {
    etherRouterAddress: networkAddress,
    // eslint-disable-next-line global-require
  } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
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
  //   // '0x9dF24e73f40b2a911Eb254A8825103723E13209C',
  //   // '0x27fF0C145E191C22C75cD123C679C3e1F58a4469',
  //   '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
  // ];

  // get reputation for each address
  const members = await Promise.all(
    addresses.map(async (address) => {
      console.log(`🚀 ~ addresses.map ~ address`, address);

      const { data } = await graphqlRequest(
        getUser,
        {
          id: utils.getAddress(address),
        },
        GRAPHQL_URI,
        API_KEY,
      );
      const user = data?.getUserByAddress?.items[0] || {};

      try {
        const userReputationForAllDomains =
          await colonyClient.getReputationAcrossDomains(address);

        // Extract only the relevant data and
        // transform the user reputation amount on each domain to percentage
        const formattedUserReputations = userReputationForAllDomains.map(
          async (userReputation) => {
            if (!userReputation?.reputationAmount) {
              return {};
            }

            console.log(`🚀 ~ userReputation`, userReputation);
            const totalColonyReputation =
              await colonyClient.getReputationWithoutProofs(
                skillId,
                address,
                rootHash,
              );

            const reputationPercentage = calculatePercentageReputation(
              userReputation.reputationAmount?.toString(),
              totalColonyReputation.reputationAmount?.toString(),
            );
            console.log(`🚀 ~ reputationPercentage`, reputationPercentage);
            return {
              reputationPercentage,
              domainId: userReputation.domainId,
            };
          },
        );
        const formattedUserReputationsResult = await Promise.all(
          formattedUserReputations,
        );

        // Filter out the reputation percentages that are 0
        const filteredUserReputations = formattedUserReputationsResult.filter(
          (userReputation) =>
            userReputation.reputationPercentage &&
            userReputation.reputationPercentage !== ZERO,
        );

        // Sort out the percentages from highest to lowest
        // and extract up to 3 reputations from the array
        const topUserReputations = [...filteredUserReputations]
          .sort((reputationA, reputationB) => {
            const safeReputationA = new Decimal(
              reputationA?.reputationPercentage &&
              reputationA?.reputationPercentage !== NEARZERO
                ? reputationA.reputationPercentage
                : 0,
            );
            const safeReputationB = new Decimal(
              reputationB?.reputationPercentage &&
              reputationB?.reputationPercentage !== NEARZERO
                ? reputationB.reputationPercentage
                : 0,
            );

            if (safeReputationB.eq(safeReputationA)) {
              return 0;
            }
            if (
              safeReputationB.lt(safeReputationA) &&
              reputationB.domainId !== ROOT_DOMAIN_ID
            ) {
              return -1;
            }
            return 1;
          })
          .slice(0, 3);

        console.log(
          `🚀 ~ addresses.map ~ topUserReputations`,
          topUserReputations,
        );

        return {
          user: user || {},
          reputation: topUserReputations,
        };
      } catch (error) {
        console.log(`🚀catch - error`, error);
        return null;
      }
    }),
  );
  console.log(`🚀 members: `, members);

  return {
    contributors: members,
  };
};
