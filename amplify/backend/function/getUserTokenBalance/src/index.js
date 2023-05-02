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

Logger.setLogLevel(Logger.levels.ERROR);

let networkAddress;
try {
  const artifacts = require('../../../../mock-data/colonyNetworkArtifacts/etherrouter-address.json');
  networkAddress = artifacts.etherRouterAddress;
} catch (error) {
  // silent error
  // means we're in a production environment without access to the contract build artifacts
}

const RPC_URL =
  process.env.CHAIN_RPC_ENDPOINT || 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks
const NETWORK = process.env.CHAIN_RPC_ENDPOINT || Network.Custom;
const NETWORK_ADDRESS = process.env.CHAIN_NETWORK_CONTRACT || networkAddress;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
(
  exports.handler = async (event) => {
    const { walletAddress, tokenAddress } = event.arguments?.input || {};
    const provider = new providers.JsonRpcProvider(RPC_URL);

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
      // Get token balance
      const tokenClient = await getTokenClient(tokenAddress, provider);

      const networkClient = getColonyNetworkClient(NETWORK, provider, {
        networkAddress: NETWORK_ADDRESS,
      });

      const tokenLockingClient = await networkClient.getTokenLockingClient();
      const userLock = await tokenLockingClient.getUserLock(
        tokenAddress,
        walletAddress,
      );

      /** @TODO Get staked tokens from voting rep client */
      const stakedTokens = 0;
      const totalObligation = await tokenLockingClient.getTotalObligation(
        walletAddress,
        tokenAddress,
      );

      const inactiveBalance = await tokenClient.balanceOf(walletAddress);
      const lockedBalance = totalObligation.add(stakedTokens);
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
    } catch {
      console.error('Could not get token balance');
      return null;
    }
  }
);
