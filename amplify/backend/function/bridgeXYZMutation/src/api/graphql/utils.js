const fetch = require('cross-fetch');

const EnvVarsConfig = require('../../config/envVars.js');

const graphqlRequest = async (queryOrMutation, variables) => {
  const { appSyncApiKey: authKey, graphqlURL: url } =
    await EnvVarsConfig.getEnvVars();

  const options = {
    method: 'POST',
    headers: {
      'x-api-key': authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryOrMutation,
      variables,
    }),
  };

  let body;
  let response;

  try {
    response = await fetch(url, options);
    body = await response.json();
    return body;
  } catch (error) {
    /*
     * Something went wrong... obviously 🦆
     */
    console.error(error);
    return null;
  }
};

module.exports = {
  graphqlRequest,
};
