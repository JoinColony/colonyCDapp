const {
  abi: metaTxAbi,
  bytecode: metaTxBytecode,
} = require('@colony/abis/versions/hmwss/MetaTxToken');
const { providers, ContractFactory } = require('ethers');
const readline = require('readline');
const { graphqlRequest } = require('./utils/graphqlRequest');
const { unlockMintTokens } = require('./utils/unlockMintTokens');

const API_KEY = 'da2-fakeApiId123456';
const GRAPHQL_URI =
  process.env.AWS_APPSYNC_GRAPHQL_URL || 'http://localhost:20002/graphql';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt for any input
function promptQuestion(question) {
  return new Promise((resolve) => {
    rl.question(`${question}: `, (answer) => {
      resolve(answer.trim());
    });
  });
}

/*
 * Queries
 */

const getColony = /* GraphQL */ `
  query GetColony($id: ID!) {
    getColony(id: $id) {
      colonyAddress: id
      nativeToken {
        tokenAddress: id
        name
        symbol
        decimals
        avatar
        thumbnail
        type
      }
    }
  }
`;

const getProxyColony = /* GraphQL */ `
  query GetProxyColony($id: ID!) {
    getProxyColony(id: $id) {
      id
    }
  }
`;

/*
 * Mutations
 */
const createForeignToken = /* GraphQL */ `
  mutation CreateToken($input: CreateTokenInput!) {
    createToken(input: $input) {
      id
    }
  }
`;

const graphqlRequestPreconfigured = async (queryOrMutation, variables) =>
  graphqlRequest(queryOrMutation, variables, GRAPHQL_URI, API_KEY);

const TokenFactoryConfig = (() => {
  let tokenFactory = null;

  const createTokenFactory = (abi, bytecode, rpcUrl) => {
    // Initialize the foreign provider using the provided RPC URL
    const foreignProvider = new providers.JsonRpcProvider(rpcUrl);

    // Get the signer from the provider
    const foreignSigner = foreignProvider.getSigner();

    // Create the contract factory using the signer and bytecode
    return new ContractFactory(abi, bytecode, foreignSigner);
  };

  return {
    getTokenFactory: (rpcUrl) => {
      if (!tokenFactory) {
        tokenFactory = createTokenFactory(metaTxAbi, metaTxBytecode, rpcUrl);
      }

      return tokenFactory;
    },
  };
})();

const getDeployedColonyToChain = async (chainId, colonyAddress) => {
  const colonyQuery = await graphqlRequestPreconfigured(getColony, {
    id: colonyAddress,
  });

  if (colonyQuery?.errors) {
    throw Error(JSON.stringify(colonyQuery?.errors));
  }

  const colony = colonyQuery?.data?.getColony;

  const proxyColonyQuery = await graphqlRequestPreconfigured(getProxyColony, {
    id: `${colony.colonyAddress}_${chainId}`,
  });

  const hasErrors = !!proxyColonyQuery?.errors;
  const isProxyColonyExisting = !!proxyColonyQuery?.data?.getProxyColony?.id;

  if (!hasErrors && isProxyColonyExisting) {
    return colony;
  }
};

const deployNativeTokenToChain = async (
  tokenFactory,
  chainId,
  colonyNativeToken,
  colonyAddress,
) => {
  try {
    if (!colonyNativeToken) {
      throw new Error(
        `No native token setup for colony with address ${colonyAddress}.`,
      );
    }

    const foreignToken = await tokenFactory.deploy(
      colonyNativeToken.name,
      colonyNativeToken.symbol,
      colonyNativeToken.decimals,
    );

    await foreignToken.deployTransaction.wait();

    const createForeignTokenMutationResult = await graphqlRequestPreconfigured(
      createForeignToken,
      {
        input: {
          id: foreignToken.address,
          name: `${colonyNativeToken.name} ${chainId}`,
          symbol: colonyNativeToken.symbol,
          decimals: colonyNativeToken.decimals,
          avatar: colonyNativeToken.avatar,
          thumbnail: colonyNativeToken.thumbnail,
          type: colonyNativeToken.type,
          chainMetadata: {
            chainId,
          },
        },
      },
    );

    if (createForeignTokenMutationResult.errors) {
      throw new Error(
        `Error creating token for ${chainId} and ${colonyAddress}: ${JSON.stringify(createForeignTokenMutationResult.errors)}`,
      );
    }

    console.log(
      `Proxy token with address ${foreignToken.address} successfully deployed for colony with address ${colonyAddress}.`,
    );

    return foreignToken;
  } catch (error) {
    console.error(
      `Error deploying proxy token for ${colonyAddress}: ${error.message}`,
    );
  }
};

const getArgumentsFromConsole = async () => {
  const foreignChainId = await promptQuestion(
    'Please provide the foreignChainId',
  );

  if (isNaN(foreignChainId) || Number.isInteger(foreignChainId)) {
    console.error(
      'Error: The foreignChainId cannot be empty and must be a number.',
    );
    process.exit(1);
  }

  const foreignChainRpcUrl = await promptQuestion(
    'Please provide the foreignChainRpcUrl',
  );

  if (!foreignChainRpcUrl) {
    console.error('Error: The foreignChainRpcUrl cannot be empty.');
    process.exit(1);
  }

  const colonyAddress = await promptQuestion(
    'Please provide the colonyAddress',
  );

  if (!colonyAddress) {
    console.error('Error: The colonyAddress cannot be empty.');
    process.exit(1);
  }

  return {
    colonyAddress,
    foreignChainId,
    foreignChainRpcUrl,
  };
};

const furtherActionsOnToken = async (colonyAddress, foreignToken) => {
  const unlockMintTokensAction = await promptQuestion(
    'Do you want to unlock and mint tokens now? Y/N',
  );

  if (unlockMintTokensAction.toUpperCase() !== 'Y') {
    console.log(
      'Skipping token unlock and minting. If you change your mind, please use the mint-tokens-on-chain script.',
    );
    return;
  }

  const tokenAmount = await promptQuestion(
    'Please provide a numeric tokenAmount. Press enter to default to 100',
  );

  if (tokenAmount && (isNaN(tokenAmount) || Number(tokenAmount) <= 0)) {
    console.error('Error: Please enter a valid number greater than 0.');
    process.exit(1);
  }

  await unlockMintTokens(
    colonyAddress,
    foreignToken,
    !tokenAmount ? 100 : Number(tokenAmount),
  );
};

const start = async () => {
  try {
    const { foreignChainId, foreignChainRpcUrl, colonyAddress } =
      await getArgumentsFromConsole();

    const tokenFactory = TokenFactoryConfig.getTokenFactory(foreignChainRpcUrl);
    const deployedColony = await getDeployedColonyToChain(
      foreignChainId,
      colonyAddress,
    );

    const { nativeToken: colonyNativeToken } = deployedColony;
    const foreignToken = await deployNativeTokenToChain(
      tokenFactory,
      foreignChainId,
      colonyNativeToken,
      colonyAddress,
    );

    await furtherActionsOnToken(colonyAddress, foreignToken);
  } catch (error) {
    console.error(
      `There was an error executing the deploy-token-to-chain script. Error: ${error.message}`,
    );
  } finally {
    rl.close();
  }
};

start();
