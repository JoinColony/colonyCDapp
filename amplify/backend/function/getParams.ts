const { default: fetch } = require('node-fetch');

interface Resource {
  Parameter: {
    Value: string;
  };
}

const AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN;
const ENV = process.env.ENV;
const AWS_PARAMS_ENDPOINT = 'localhost:2773';

const ParamNames = {
  graphqlUrl: `%2Famplify%2Fcdapp%2F${ENV}%2Faws_appsync_graphql_url`,
  reputationEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2Freputation_endpoint`,
  networkContractAddress: `%2Famplify%2Fcdapp%2F${ENV}%2Fchain_network_contract`,
  chainRpcEndpoint: `%2Famplify%2Fcdapp%2F${ENV}%2Fchain_rpc_endpoint`,
  chainNetwork: `%2Famplify%2Fcdapp%2F${ENV}%2Fchain_network`,
  appsyncApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2Faws_appsync_api_key`,
  firebaseAdminConfig: `%2Famplify%2Fcdapp%2F${ENV}%2FfirebaseAdminConfig`,
  mailJetApiKey: `%2Famplify%2Fcdapp%2F${ENV}%2FmailJetApiKey`,
  mailJetApiSecret: `%2Famplify%2Fcdapp%2F${ENV}%2FmailJetApiSecret`,
} as const;

const paramsCache: { [key: string]: string } = {};

const getParam = async (paramName: keyof typeof ParamNames) => {
  if (!(paramName in ParamNames)) {
    throw Error(`Invalid param name '${paramName}' provided.`);
  }

  if (paramsCache[paramName]) {
    return paramsCache[paramName];
  }

  if (!AWS_SESSION_TOKEN) {
    throw Error(`No AWS Session Token found`);
  }

  const decrpytParam =
    paramName === 'appsyncApiKey' ? '&withDecryption=true' : '';

  // Retrieve param from Parameter Store
  try {
    const res = await fetch(
      `http://${AWS_PARAMS_ENDPOINT}/systemsmanager/parameters/get?name=${ParamNames[paramName]}${decrpytParam}`,
      {
        headers: {
          'X-Aws-Parameters-Secrets-Token': AWS_SESSION_TOKEN,
        },
      },
    );
    const resource = (await res.json()) as Resource;
    const {
      Parameter: { Value },
    } = resource;

    paramsCache[paramName] = Value;

    return Value;
  } catch (e) {
    console.error(e);
    return '';
  }
};

export const getParams = async (paramNames: Array<keyof typeof ParamNames>) => {
  if (!Array.isArray(paramNames)) {
    throw new Error(
      `Parameter names must be passed as an array of strings. Not: ${paramNames}`,
    );
  }

  const ENV = process.env.ENV;

  if (ENV === 'qa') {
    const params = Promise.all(paramNames.map((name) => getParam(name)));
    return params || [];
  }

  return [];
};
