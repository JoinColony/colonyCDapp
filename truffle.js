/* eslint-disable camelcase */

module.exports = {
  contracts_build_directory:
    './amplify/mock-data/colonyNetworkArtifacts/build/contracts',
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      gasPrice: 0,
      network_id: '*',
      skipDryRun: true,
      disableConfirmationListener: true,
    },
  },
};
