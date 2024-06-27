const fetch = require('cross-fetch');

const AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN;
const ENV = process.env.ENV;

const ParamNames = {
  graphqlUrl: `%2Famplify%2Fcdapp%2F${ENV}%2Faws_appsync_graphql_url`,
  reputationEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2Freputation_endpoint`,
  networkContractAddress: `%2Famplify%2Fcdapp%2F${ENV}%2Fchain_network_contract`,
  chainRpcEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2Fchain_rpc_endpoint`,
  chainNetwork: `%2Famplify%2Fcdapp%2F${ENV}%2Fchain_network`,
  appsyncApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2Faws_appsync_api_key`,
  bnbRpcEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2Fbnb_rpc_endpoint`,
  ethRpcEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2Feth_rpc_endpoint`,
  bscscanApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2Fbscscan_api_key`,
  etherscanApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2Fetherscan_api_key`,
  bridgeXYZApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2Fbridgexyz_api_key`,
  bridgeXYZApiUrl: `%2Famplify%2Fcdapp%2F${ENV}%2Fbridgexyz_api_url`,
};

const getParam = async (paramName) => {
  if (!(paramName in ParamNames)) {
    throw Error(`Invalid param name '${paramName}' provided.`);
  }

  // Retrieve param from Parameter Store
  try {
    const res = await fetch(
      `http://localhost:2773/systemsmanager/parameters/get?name=${ParamNames[paramName]}&withDecryption=true`,
      {
        headers: {
          'X-Aws-Parameters-Secrets-Token': AWS_SESSION_TOKEN,
        },
      },
    );

    const resource = await res.json();
    const {
      Parameter: { Value },
    } = resource;
    return Value;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const getParams = async (params) => {
  if (!Array.isArray(params)) {
    console.error('Parameter names must be passed as an array of strings.');
    return undefined;
  }

  return Promise.all(params.map((param) => getParam(param)));
};

module.exports = {
  getParam,
  getParams,
};
