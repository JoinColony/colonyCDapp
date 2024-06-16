const fetch = require('cross-fetch');
const { getUserStakesInColony } = require('./graphql');
const { BigNumber } = require('ethers');

const graphqlRequest = async (
  queryOrMutation,
  variables,
  apiKey,
  graphqlURL,
) => {
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
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
    response = await fetch(graphqlURL, options);
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

const getColonyStakeId = (walletAddress, colonyAddress) => {
  return `${walletAddress}_${colonyAddress}`;
};

const getStakedTokens = async (
  walletAddress,
  colonyAddress,
  apiKey,
  graphqlURL,
) => {
  const { data } =
    (await graphqlRequest(
      getUserStakesInColony,
      {
        userAddress: walletAddress,
        colonyAddress,
      },
      apiKey,
      graphqlURL,
    )) ?? {};

  let totalAmount = BigNumber.from(0);
  if (data?.getUserStakesInColony) {
    data.getUserStakesInColony.items.forEach((item) => {
      totalAmount = totalAmount.add(item.amount);
    });
  } else {
    console.error(
      `Could not get user ${walletAddress} stakes in colony ${colonyAddress}`,
    );
  }

  return totalAmount.toString();
};

module.exports = {
  graphqlRequest,
  getStakedTokens,
};
