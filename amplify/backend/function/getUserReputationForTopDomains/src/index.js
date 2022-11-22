// const { getColonyNetworkClient, Network } = require('@colony/colony-js');
// const {
//   providers,
//   utils: { Logger },
// } = require('ethers');
// const { constants } = require('ethers');
// const { Decimal } = require('decimal.js');
// const { calculatePercentageReputation } = require('~utils/reputation');

// Logger.setLogLevel(Logger.levels.ERROR);

// const ROOT_DOMAIN_ID = 1; // this used to be exported from @colony/colony-js but isn't anymore
// const RPC_URL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

/**
 * @type {import('aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  return 'this is the first test';
  // const input = event.arguments?.input;
  // const colonyAddress = input?.colonyAddress;
  // const walletAddress = input?.walletAddress;
  // const rootHash = input?.rootHash;

  // const provider = new providers.JsonRpcProvider(RPC_URL);

  // const {
  //   etherRouterAddress: networkAddress,
  // } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');

  // const networkClient = getColonyNetworkClient(Network.Custom, provider, {
  //   networkAddress,
  //   reputationOracleEndpoint: 'http://localhost:3002/reputation',
  // });
  // const colonyClient = await networkClient.getColonyClient(colonyAddress);

  // try {
  //   const userReputationForAllDomains =
  //     await colonyClient.getReputationForTopDomains(walletAddress, rootHash);

  //   // Extract only the relevant data and
  //   // transform the user reputation amount on each domain to percentage
  //   const formattedUserReputations = userReputationForAllDomains.map(
  //     async (userReputation) => {
  //       const { skillId } = await colonyClient.getDomain(
  //         userReputation.domainId ?? ROOT_DOMAIN_ID,
  //       );
  //       const { totalColonyReputation } =
  //         await colonyClient.getReputationWithoutProofs(
  //           skillId,
  //           constants.AddressZero,
  //           rootHash,
  //         );

  //       const reputationPercentage = calculatePercentageReputation(
  //         userReputation.reputationAmount?.toString(),
  //         totalColonyReputation.toString(),
  //       );
  //       return {
  //         reputationPercentage,
  //         domainId: userReputation.domainId,
  //       };
  //     },
  //   );
  //   const formattedUserReputationsResult = await Promise.all(
  //     formattedUserReputations,
  //   );

  //   // Filter out the reputation percentages that are 0
  //   const filteredUserReputations = formattedUserReputationsResult.filter(
  //     (userReputation) =>
  //       userReputation.reputationPercentage &&
  //       userReputation.reputationPercentage !== constants.ZeroValue.Zero,
  //   );

  //   // Sort out the percentages from highest to lowest
  //   // and extract up to 3 reputations from the array
  //   const topUserReputations = [...filteredUserReputations]
  //     .sort((reputationA, reputationB) => {
  //       const safeReputationA = new Decimal(
  //         reputationA?.reputationPercentage &&
  //         reputationA?.reputationPercentage !== constants.ZeroValue.NearZero
  //           ? reputationA.reputationPercentage
  //           : 0,
  //       );
  //       const safeReputationB = new Decimal(
  //         reputationB?.reputationPercentage &&
  //         reputationB?.reputationPercentage !== constants.ZeroValue.NearZero
  //           ? reputationB.reputationPercentage
  //           : 0,
  //       );

  //       if (safeReputationB.eq(safeReputationA)) {
  //         return 0;
  //       }
  //       if (
  //         safeReputationB.lt(safeReputationA) &&
  //         reputationB.domainId !== ROOT_DOMAIN_ID
  //       ) {
  //         return -1;
  //       }
  //       return 1;
  //     })
  //     .slice(0, 3);

  //   // return topUserReputations;
  //   return '12312321312321';
  //   // return { reputationPercentage: 50, domainId: 10 };
  // } catch (error) {
  //   return null;
  // }
};
