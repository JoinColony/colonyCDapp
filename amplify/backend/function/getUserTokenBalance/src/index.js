require('cross-fetch/polyfill');
const {
  getTokenClient,
  getColonyNetworkClient,
  Network,
} = require('@colony/colony-js');

const {
  providers,
  utils: { Logger },
  constants,
} = require('ethers');

const { getUnclaimedMotionStakesAmount } = require('./utils');

Logger.setLogLevel(Logger.levels.ERROR);

let rpcURL = 'http://network-contracts:8545'; // this needs to be extended to all supported networks
let network = Network.Custom;
let networkAddress;
let apiKey = 'da2-fakeApiId123456';
let graphqlURL = 'http://localhost:20002/graphql';

const setEnvVariables = async () => {
  const ENV = process.env.ENV;
  if (ENV === 'qa' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [rpcURL, networkAddress, network, apiKey, graphqlURL] = await getParams([
      'chainRpcEndpoint',
      'networkContractAddress',
      'chainNetwork',
      'appsyncApiKey',
      'graphqlUrl',
    ]);
  } else {
    const {
      etherRouterAddress,
    } = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
    networkAddress = etherRouterAddress;
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
(
  exports.handler = async (event) => {
    try {
      await setEnvVariables();
    } catch (e) {
      throw new Error('Unable to set env variables. Reason:', e);
    }

    const { walletAddress, tokenAddress, colonyAddress } =
      event.arguments?.input || {};
    const provider = new providers.StaticJsonRpcProvider(rpcURL);

    if (tokenAddress === constants.AddressZero) {
      // Get chain native token balance
      try {
        const balance = await provider.getBalance(walletAddress);
        return {
          balance: balance.toString(),
        };
      } catch {
        console.error('Could not get native token balance');
        return null;
      }
    }

    try {
      /**
       * Here's an attempt at documenting each term in the return object:
       * - inactiveBalance: The balance of the token in the user's wallet
       * - activeBalance: The balance of locked tokens that are not staked
       * - lockedBalance: The value of `totalObligations` for the user tracked by TokenLockingClient.
       *                  It includes stakes made when creating a staked expenditure but excludes stakes made for a motion
       * - pendingBalance: Balance that failed to be transferred from the userLock
       * See: https://github.com/JoinColony/colonyNetwork/blob/develop/contracts/tokenLocking/TokenLocking.sol for more details
       */
      // Get token balance
      const tokenClient = await getTokenClient(tokenAddress, provider);

      const networkClient = getColonyNetworkClient(network, provider, {
        networkAddress,
      });

      const tokenLockingClient = await networkClient.getTokenLockingClient();
      const userLock = await tokenLockingClient.getUserLock(
        tokenAddress,
        walletAddress,
      );

      const motionsStakeAmount = await getUnclaimedMotionStakesAmount(
        walletAddress,
        colonyAddress,
        apiKey,
        graphqlURL,
      );

      const totalObligation = await tokenLockingClient.getTotalObligation(
        walletAddress,
        tokenAddress,
      );

      const inactiveBalance = await tokenClient.balanceOf(walletAddress);
      const lockedBalance = totalObligation.add(motionsStakeAmount);
      const activeBalance = userLock.balance.sub(totalObligation);
      const totalBalance = inactiveBalance
        .add(lockedBalance)
        .add(activeBalance);

      return {
        balance: totalBalance.toString(),
        inactiveBalance: inactiveBalance.toString(),
        lockedBalance: lockedBalance.toString(),
        activeBalance: activeBalance.toString(),
        pendingBalance: userLock.pendingBalance.toString(),
      };
    } catch (e) {
      console.error('Could not get token balance', e);
      return null;
    }
  }
);
