const { constants, utils, providers, Contract } = require('ethers');

const basicTokenAbi = require('./basicTokenAbi.json');
const {
  graphqlRequest,
  getTokenType,
  getRpcUrlParamName,
  getDevRpcUrl,
} = require('./utils');

/*
 * @TODO This needs to be imported properly into the project (maybe?)
 * So that we can always ensure it follows the latest schema
 * (currently it's just saved statically)
 */
const { createToken, getTokenByAddress } = require('./graphql');

let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';
let rpcURL;

const baseToken = {
  __typename: 'Token',
  id: null, // token's contract address
  name: null,
  symbol: null,
  decimals: null,
  type: null,
  colonies: null,
};

const setEnvVariables = async (network) => {
  const ENV = process.env.ENV;
  if (ENV === 'dev') {
    rpcURL = getDevRpcUrl(network);
  }

  if (ENV === 'qa' || ENV === 'sc') {
    let chainRpcParam = getRpcUrlParamName(network);

    const { getParams } = require('/opt/nodejs/getParams');
    [apiKey, graphqlURL, rpcURL] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
      chainRpcParam,
    ]);
  }
};

exports.handler = async (event) => {
  const {
    tokenAddress = constants.AddressZero,
    network = undefined, // refers to the shortName in the NetworkInfo type
  } =
    // eslint-disable-next-line no-unsafe-optional-chaining
    event?.arguments?.input;

  try {
    await setEnvVariables(network);
  } catch (e) {
    throw new Error('Unable to set env variables. Reason:', e);
  }

  /*
   * We do not store native chain tokens in the database and the ethers logic
   * fails with a native token so return null early
   */
  if (tokenAddress === constants.AddressZero) {
    return null;
  }

  const tokenQuery = await graphqlRequest(
    getTokenByAddress,
    { id: tokenAddress },
    graphqlURL,
    apiKey,
  );

  // eslint-disable-next-line no-unsafe-optional-chaining
  const [token] = tokenQuery?.data?.getTokenByAddress?.items;

  /*
   * GraphQL fetching error, we need to short circuit
   */
  if (!tokenQuery) {
    return null;
  }

  /*
   * Token not in database
   */

  if (tokenQuery && !token) {
    try {
      /*
       * Attempt to fetch it from the chain
       */
      const checksummedAddress = utils.getAddress(tokenAddress);
      const provider = new providers.JsonRpcProvider(rpcURL);
      const tokenFromChain = new Contract(
        checksummedAddress,
        basicTokenAbi,
        provider,
      );
      const name = await tokenFromChain.name();
      const symbol = await tokenFromChain.symbol();
      const decimals = await tokenFromChain.decimals();
      const type = await getTokenType(tokenFromChain);

      /*
       * Save it to the database first
       */

      const tokenMutation = await graphqlRequest(
        createToken,
        {
          input: {
            id: checksummedAddress,
            decimals,
            name,
            symbol,
            type,
            /*
             * @TODO These need to be properly added once Lambda Functions
             * have the concept of chains
             */
            chainMetadata: {
              chainId: (await provider.getNetwork()).chainId,
            },
          },
        },
        graphqlURL,
        apiKey,
      );

      const { createdAt = new Date(), updatedAt = new Date() } =
        // eslint-disable-next-line no-unsafe-optional-chaining
        tokenMutation?.data?.createToken;

      return {
        items: [
          {
            ...baseToken,
            id: checksummedAddress,
            name,
            decimals,
            symbol,
            type,
            createdAt,
            updatedAt,
          },
        ],
      };
    } catch (error) {
      /*
       * Something went wrong, most likely the token's contract address is not valid
       */
      console.error(error);
      return null;
    }
  }

  /*
   * Return the token from the database
   */
  return {
    items: [
      {
        ...baseToken,
        ...token,
      },
    ],
  };
};
