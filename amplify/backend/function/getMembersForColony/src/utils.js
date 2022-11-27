const { default: fetch, Request } = require('node-fetch');

const ROOT_DOMAIN_ID = 1; // this used to be exported from @colony/colony-js but isn't anymore

const graphqlRequest = async (queryOrMutation, variables, url, authKey) => {
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

  const request = new Request(url, options);

  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    return body;
  } catch (error) {
    /*
     * Something went wrong... obviously
     */
    console.error(error);
    return null;
  }
};

const getUserReputation = async ({
  colonyClient,
  walletAddress,
  domainId,
  rootHash,
}) => {
  const { skillId } = await colonyClient.getDomain(domainId ?? ROOT_DOMAIN_ID);

  let reputationAmount;
  try {
    reputationAmount = await colonyClient.getReputationWithoutProofs(
      skillId,
      walletAddress,
      rootHash,
    );
  } catch (error) {
    return null;
  }

  return reputationAmount.toString();
};

module.exports = {
  graphqlRequest,
  getUserReputation,
};
