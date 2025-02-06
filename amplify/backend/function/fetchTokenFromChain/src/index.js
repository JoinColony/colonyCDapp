const { constants, utils, providers, Contract } = require('ethers');
const { abi } = require('@colony/abis/versions/hmwss/MetaTxToken');

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
const {
  createToken,
  getTokenByAddress,
  getColonyByAddress,
  getUserByAddress,
} = require('./graphql');

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
  chainMetadata: {
    chainId: '',
  },
};

const setEnvVariables = async (network) => {
  const ENV = process.env.ENV;
  if (ENV === 'dev') {
    rpcURL = getDevRpcUrl(network);
  }

  if (ENV === 'qa' || ENV === 'prod') {
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
    avatar,
    thumbnail,
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
      // Check this address is not currently in use by a colony
      const colonyQuery = await graphqlRequest(
        getColonyByAddress,
        { address: tokenAddress },
        graphqlURL,
        apiKey,
      );

      if (colonyQuery?.data?.getColonyByAddress?.items.length > 0) {
        throw new Error(`${tokenAddress} is already in use by a colony.`);
      }

      // Check this address is not currently in use by a user
      const userQuery = await graphqlRequest(
        getUserByAddress,
        { address: tokenAddress },
        graphqlURL,
        apiKey,
      );

      if (userQuery?.data?.getUserByAddress?.items.length > 0) {
        throw new Error(`${tokenAddress} is already in use by a user.`);
      }

      /*
       * Attempt to fetch it from the chain
       */
      const checksummedAddress = utils.getAddress(tokenAddress);
      const provider = new providers.StaticJsonRpcProvider(rpcURL);
      const tokenFromChain = new Contract(checksummedAddress, abi, provider);

      const contractCode = await provider.getCode(checksummedAddress);
      // Check there is a contract deployed at this address
      if (contractCode === '0x') {
        throw new Error(
          `There is no contract current deployed at: ${checksummedAddress}`,
        );
      }

      tokenFromChain.interface.encodeFunctionData('totalSupply', []);

      // Call each of the following required ERC20 functions using their function selectors
      // If these contract calls succeed without throwing an error, it is likely an ERC20 token contract
      const erc20Functions = [
        tokenFromChain.interface.encodeFunctionData('totalSupply', []),
        tokenFromChain.interface.encodeFunctionData('balanceOf', [
          checksummedAddress,
        ]),
        tokenFromChain.interface.encodeFunctionData('allowance', [
          checksummedAddress,
          constants.AddressZero,
        ]),
      ];

      for (const erc20Function of erc20Functions) {
        await provider.estimateGas({
          to: checksummedAddress,
          data: erc20Function,
        });
      }

      let name = checksummedAddress;
      let symbol = checksummedAddress.slice(0, 6);
      let decimals = 0;
      try {
        name = await tokenFromChain.name();
      } catch (error) {
        console.log(
          `TOKEN NAME NOT AVAILABLE, FALLING BACK TO: "${name}"`,
          error,
        );
      }
      try {
        symbol = await tokenFromChain.symbol();
      } catch (error) {
        console.log(
          `TOKEN SYMBOL NOT AVAILABLE, FALLING BACK TO: "${symbol}"`,
          error,
        );
      }
      try {
        decimals = await tokenFromChain.decimals();
      } catch (error) {
        console.log(
          `TOKEN DECIMALS NOT AVAILABLE, FALLING BACK TO: "${decimals}"`,
          error,
        );
      }
      const type = await getTokenType(tokenFromChain);
      const chainId = String((await provider.getNetwork()).chainId);

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
            avatar,
            thumbnail,
            /*
             * @TODO These need to be properly added once Lambda Functions
             * have the concept of chains
             */
            chainMetadata: {
              chainId,
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
