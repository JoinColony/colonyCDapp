const {
  Network,
} = require('@colony/colony-js');

const EnvVarsSetupFactory = (() => {
    let apiKey = 'da2-fakeApiId123456';
    let graphqlURL = 'http://localhost:20002/graphql';
    let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
    let reputationOracleEndpoint =
        'http://reputation-monitor:3001/reputation/local';
    let networkAddress;
    let network = Network.Custom;
    let isInit = false;

    const setEnvVars = async () => {
        const ENV = process.env.ENV;
        if (ENV === 'qa' || ENV === 'prod') {
            const { getParams } = require('/opt/nodejs/getParams');
            [
                apiKey,
                graphqlURL,
                rpcURL,
                networkAddress,
                reputationOracleEndpoint,
                network,
            ] = await getParams([
                'appsyncApiKey',
                'graphqlUrl',
                'chainRpcEndpoint',
                'networkContractAddress',
                'reputationEndpoint',
                'chainNetwork',
            ]);
        } else {
            const {
                etherRouterAddress,
            } = require('../../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
            networkAddress = etherRouterAddress;
        }
    };

    return {
        getEnvVars: async () => {
            if (!isInit) {
                await setEnvVars();
                isInit = true;
            }

            return {
                apiKey,
                graphqlURL,
                rpcURL,
                reputationOracleEndpoint,
                networkAddress,
                network,
            }
        }
    };
})();

module.exports = EnvVarsSetupFactory;