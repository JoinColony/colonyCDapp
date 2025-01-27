const { abi: metaTxAbi } = require('@colony/abis/versions/hmwss/MetaTxToken');
const { utils, providers, Contract } = require('ethers');
const readline = require('readline');

const { unlockMintTokens } = require('./utils/unlockMintTokens');

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

const TokenConfig = (() => {
  let token = null;

  const getTokenContract = (tokenAddress, abi, rpcUrl) => {
    // Initialize the foreign provider using the provided RPC URL
    const foreignProvider = new providers.JsonRpcProvider(rpcUrl);

    // Get the signer from the provider
    const foreignSigner = foreignProvider.getSigner();

    const checksummedAddress = utils.getAddress(tokenAddress);

    // Create the contract factory using the signer and bytecode
    return new Contract(checksummedAddress, abi, foreignSigner);
  };

  return {
    getToken: (tokenAddress, rpcUrl) => {
      if (!token) {
        token = getTokenContract(tokenAddress, metaTxAbi, rpcUrl);
      }

      return token;
    },
  };
})();

const getArgumentsFromConsole = async () => {
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

  const tokenAddress = await promptQuestion('Please provide the tokenAddress');

  if (!tokenAddress) {
    console.error('Error: The tokenAddress cannot be empty.');
    process.exit(1);
  }

  const tokenAmount = await promptQuestion(
    'Please provide a numeric tokenAmount. Press enter to default to 100',
  );

  if (tokenAmount && (isNaN(tokenAmount) || Number(tokenAmount) <= 0)) {
    console.error('Error: Please enter a valid number greater than 0.');
    process.exit(1);
  }

  return {
    foreignChainRpcUrl,
    colonyAddress,
    tokenAddress,
    tokenAmount: !tokenAmount ? 100 : Number(tokenAmount),
  };
};

async function start() {
  try {
    const { foreignChainRpcUrl, colonyAddress, tokenAddress, tokenAmount } =
      await getArgumentsFromConsole();

    const token = TokenConfig.getToken(tokenAddress, foreignChainRpcUrl);

    await unlockMintTokens(colonyAddress, token, tokenAmount);
  } catch (error) {
    console.error(
      `There was an error executing the deploy-token-to-chain script. Error: ${error.message}`,
    );
  } finally {
    rl.close();
  }
}

start();
