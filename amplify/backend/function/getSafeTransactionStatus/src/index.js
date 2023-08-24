const { providers } = require('ethers');

const {
  SUPPORTED_SAFE_NETWORKS,
  getHomeBridgeByChain,
  getForeignBridgeByChain,
  getMessageIds,
  checkIfTheMessageWasDelivered,
  TRANSACTION_STATUS,
  isDev,
} = require('./utils');

const rpcURL = 'http://network-contracts.docker:8545'; // this needs to be extended to all supported networks

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  const { transactionHash, chainId } = event.arguments?.input || {};

  if (!transactionHash) {
    return [];
  }

  const provider = new providers.JsonRpcProvider(rpcURL);
  const transactionReceipt = await provider.getTransactionReceipt(
    transactionHash,
  );

  const networkApiURI =
    SUPPORTED_SAFE_NETWORKS.find((network) => network.chainId === chainId)
      .apiUri || '';
  const homeAMBContract = getHomeBridgeByChain(chainId);
  const foreignAMBContract = getForeignBridgeByChain(chainId);

  const messageIds = getMessageIds(
    transactionReceipt,
    homeAMBContract,
    homeAMBContract.address,
  );

  const transactionStatuses = await Promise.all(
    messageIds.map(async (messageId) => {
      const wasTheMessageDelivered = await checkIfTheMessageWasDelivered(
        foreignAMBContract,
        networkApiURI,
        messageId,
        chainId.toString(),
      );

      // @NOTE: Safe transactions will always be executed automatically on the local env
      if (wasTheMessageDelivered || isDev) {
        return TRANSACTION_STATUS.COMPLETED;
      }
      return TRANSACTION_STATUS.ACTION_NEEDED;
    }),
  );

  return transactionStatuses;
};
