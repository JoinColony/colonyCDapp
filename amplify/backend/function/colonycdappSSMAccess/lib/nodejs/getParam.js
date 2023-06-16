const { default: fetch } = require('node-fetch');

const AWS_SESSION_TOKEN =  process.env.AWS_SESSION_TOKEN;
const ENV = process.env.ENV;

const ParamNames = {
  graphqlUrl: `%2Famplify%2Fcdapp%2F${ENV}%2Faws_appsync_graphql_url`,
  reputationEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2Freputation_endpoint`,
  chainNetworkContract: `%2Famplify%2Fcdapp%2F${ENV}%2Fchain_network_contract`,
  chainRpcEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2Fchain_rpc_endpoint`,
  chainNetwork: `%2Famplify%2Fcdapp%2F${ENV}%2Fchain_network`,
  appSyncApi: `%2Famplify%2Fcdapp%2F${ENV}%2Faws_appsync_api_key`,
};

const getParam = async (paramName) => {
  if (!(paramName in ParamNames)) {
    return undefined;
  }

  const decrpytParam = paramName === 'appSyncApi' ? '&withDecryption=true' : '';

  // Retrieve param from Parameter Store
  try {
    const res = await fetch(
      `http://localhost:2773/systemsmanager/parameters/get?name=${ParamNames[paramName]}${decrpytParam}`,
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

module.exports = {
  getParam,
};
