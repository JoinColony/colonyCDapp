const fetch = require('cross-fetch');

const AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN;
const ENV = process.env.ENV;

const ParamNames = {
  graphqlUrl: `%2Famplify%2Fcdapp%2F${ENV}%2FAWS_APPSYNC_GRAPHQL_URL`,
  reputationEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2FREPUTATION_ENDPOINT`,
  networkContractAddress: `%2Famplify%2Fcdapp%2F${ENV}%2FCHAIN_NETWORK_CONTRACT`,
  chainRpcEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2FCHAIN_RPC_ENDPOINT`,
  chainNetwork: `%2Famplify%2Fcdapp%2F${ENV}%2FCHAIN_NETWORK`,
  appsyncApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2FAWS_APPSYNC_API_KEY`,
  bnbRpcEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2FBNB_RPC_ENDPOINT`,
  ethRpcEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2FETH_RPC_ENDPOINT`,
  bscscanApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2FBSCSCAN_API_KEY`,
  etherscanApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2FETHERSCAN_API_KEY`,
  bridgeXYZApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2FBRIDGEXYZ_API_KEY`,
  bridgeXYZApiUrl: `%2Famplify%2Fcdapp%2F${ENV}%2FBRIDGEXYZ_API_URL`,
  liquidationAddressOverrides: `%2Famplify%2Fcdapp%2F${ENV}%2FLIQUIDATION_ADDRESS_OVERRIDES`,
  magicbellApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2FMAGICBELL_API_KEY`,
  magicbellApiSecret: `%2Famplify%2Fcdapp%2F${ENV}%2FMAGICBELL_API_SECRET`,
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
