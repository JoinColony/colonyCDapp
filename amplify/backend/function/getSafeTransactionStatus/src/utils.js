const fetch = require('cross-fetch');
const isArray = require('lodash/isArray');
const { providers, Contract, utils } = require('ethers');
const Web3 = require('web3');

const { ForeignAMB, HomeAMB } = require('./abis');

const isDev = process.env.ENV === 'dev';

const ETHEREUM_NETWORK = {
  chainId: '1',
  apiUri: 'https://api.etherscan.io/api',
  rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
};

const BINANCE_NETWORK = {
  chainId: '56',
  apiUri: 'https://api.bscscan.com/api',
  rpcUrl: 'https://bsc-dataseed.binance.org/',
};

const SUPPORTED_SAFE_NETWORKS = [ETHEREUM_NETWORK, BINANCE_NETWORK];

const GNOSIS_AMB_BRIDGES = {
  [ETHEREUM_NETWORK.chainId]: {
    homeAMB: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
    foreignAMB: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
  },
  [BINANCE_NETWORK.chainId]: {
    homeAMB: '0x162E898bD0aacB578C8D5F8d6ca588c13d2A383F',
    foreignAMB: '0x05185872898b6f94AA600177EF41B9334B1FA48B',
  },
};

const TRANSACTION_STATUS = {
  COMPLETED: 'Completed',
  ACTION_NEEDED: 'Action needed',
};

const getApiKey = async (chainId) => {
  let bscscanApiKey = '';
  let etherscanApiKey = '';
  const ENV = process.env.ENV;

  if (ENV === 'qaarbsep' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [bscscanApiKey, etherscanApiKey] = await getParams([
      'bscscanApiKey',
      'etherscanApiKey',
    ]);
  }

  if (chainId === BINANCE_NETWORK.chainId) {
    return bscscanApiKey;
  }

  return etherscanApiKey;
};

const getMessageLogs = async (
  apiUri,
  contract,
  event,
  options,
  safeChainId,
) => {
  // @NOTE: We build a dynamic URL to check with the API if the message exists in the other side (Was executed succesfully)
  const url = new URL(apiUri);
  url.searchParams.append('module', 'logs');
  url.searchParams.append('action', 'getLogs');
  url.searchParams.append('address', contract.address);
  // @NOTE: Since it filters by the message id, only one event will be fetched
  // so there is no need to limit the range of the block to reduce the network traffic
  url.searchParams.append('fromBlock', '0');
  url.searchParams.append('toBlock', 'latest');
  url.searchParams.append('apiKey', await getApiKey(safeChainId));
  const eventTopic = utils.id(event);
  const topics = [eventTopic, ...options.topics];

  for (let i = 0; i < topics.length; i += 1) {
    if (topics[i] !== null) {
      url.searchParams.append(`topic${i}`, topics[i]);
      for (let j = 0; j < i; j += 1) {
        if (topics[j] !== null) {
          url.searchParams.append(`topic${j}_${i}_opr`, 'and');
        }
      }
    }
  }

  const logs = await fetch(url.toString()).then((res) => res.json());

  return logs.result;
};

const checkIfTheMessageWasDelivered = async (
  contract,
  api,
  messageId,
  safeChainId,
) => {
  const events = await getMessageLogs(
    api,
    contract,
    'RelayedMessage(address,address,bytes32,bool)',
    {
      topics: [null, null, messageId],
    },
    safeChainId,
  );

  if (isArray(events) && events.length > 0) {
    return true;
  }
  return false;
};

const getMessageIds = (txReceipt, homeAMBContract, bridgeAddress) => {
  const eventTopic = utils.id('UserRequestForSignature(bytes32,bytes)');

  const events = txReceipt.logs?.filter(
    (e) => e.address === bridgeAddress && e.topics[0] === eventTopic,
  );

  return (
    events?.map((event) => {
      const {
        args: { messageId },
      } = homeAMBContract.interface.parseLog(event);
      return messageId || '';
    }) || []
  );
};

const LOCAL_HOME_CHAIN = 'http://127.0.0.1:8545';
const LOCAL_FOREIGN_CHAIN = 'http://127.0.0.1:8546';

const getHomeProvider = async () => {
  const ENV = process.env.ENV;
  let rpcURL = LOCAL_HOME_CHAIN;

  if (ENV === 'qaarbsep' || ENV === 'prod') {
    const { getParams } = require('/opt/nodejs/getParams');
    [rpcURL] = await getParams(['chainRpcEndpoint']);
  }

  return new providers.StaticJsonRpcProvider(rpcURL);
};

const getForeignProvider = (safeChainId) => {
  const network = SUPPORTED_SAFE_NETWORKS.find(
    (n) => n.chainId === safeChainId,
  );

  if (!network) {
    throw new Error(
      `Network not found. Please ensure safe is deployed to a supported network.`,
    );
  }

  return new providers.StaticJsonRpcProvider(
    isDev ? LOCAL_FOREIGN_CHAIN : network.rpcUrl,
  );
};

const getForeignBridgeByChain = (safeChainId) => {
  const foreignProvider = getForeignProvider(safeChainId);
  const foreignSigner = foreignProvider.getSigner();
  const foreignBridgeAddress = isDev
    ? require('../../../../mock-data/colonyNetworkArtifacts/safe-addresses.json')
        .LOCAL_FOREIGN_BRIDGE_ADDRESS
    : GNOSIS_AMB_BRIDGES[safeChainId]?.foreignAMB;

  if (!foreignBridgeAddress) {
    throw new Error(
      `Foreign bridge address for chain with chainID ${safeChainId} not found.`,
    );
  }

  return new Contract(foreignBridgeAddress, ForeignAMB, foreignSigner);
};

const getHomeBridgeByChain = async (safeChainId) => {
  const homeProvider = await getHomeProvider();
  const homeSigner = homeProvider.getSigner();
  const homeBridgeAddress = isDev
    ? require('../../../../mock-data/colonyNetworkArtifacts/safe-addresses.json')
        .LOCAL_HOME_BRIDGE_ADDRESS
    : GNOSIS_AMB_BRIDGES[safeChainId]?.homeAMB;

  if (!homeBridgeAddress) {
    throw new Error(
      `Home bridge address for chain with chainID ${safeChainId} not found.`,
    );
  }

  return new Contract(homeBridgeAddress, HomeAMB, homeSigner);
};

module.exports = {
  getHomeBridgeByChain,
  getForeignBridgeByChain,
  getMessageIds,
  checkIfTheMessageWasDelivered,
  TRANSACTION_STATUS,
  SUPPORTED_SAFE_NETWORKS,
  isDev,
};
