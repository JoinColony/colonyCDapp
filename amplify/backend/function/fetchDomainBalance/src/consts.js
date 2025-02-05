const { Network: ColonyJSNetwork } = require('@colony/colony-js');

const DEFAULT_TOKEN_DECIMALS = 18;

const TimeframeType = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  TOTAL: 'TOTAL',
};

const paymentActionTypes = ['PAYMENT', 'PAYMENT_MOTION', 'PAYMENT_MULTISIG'];

const moveFundsActionTypes = [
  'MOVE_FUNDS',
  'MOVE_FUNDS_MOTION',
  'MOVE_FUNDS_MULTISIG',
];

const acceptedColonyActionTypes = [
  ...paymentActionTypes,
  ...moveFundsActionTypes,
];

const SupportedNetwork = {
  Mainnet: 'mainnet',
  Goerli: 'goerli',
  Gnosis: 'gnosis',
  GnosisFork: 'gnosisFork',
  Ganache: 'ganache',
  GanacheProxy1: 'ganache-proxy-1',
  GanacheProxy2: 'ganache-proxy-2',
  Polygon: 'polygon',
  Amoy: 'amoy',
  ArbitrumOne: 'arbitrumOne',
  ArbitrumSepolia: 'arbitrumSepolia',
};

const ColonyJSNetworkMapping = {
  [ColonyJSNetwork.Mainnet]: SupportedNetwork.Mainnet,
  [ColonyJSNetwork.Goerli]: SupportedNetwork.Goerli,
  [ColonyJSNetwork.Xdai]: SupportedNetwork.Gnosis,
  [ColonyJSNetwork.XdaiQa]: SupportedNetwork.GnosisFork,
  [ColonyJSNetwork.Custom]: SupportedNetwork.Ganache,
  [ColonyJSNetwork.ArbitrumOne]: SupportedNetwork.ArbitrumOne,
  [ColonyJSNetwork.ArbitrumSepolia]: SupportedNetwork.ArbitrumSepolia,
};

// import from amplify backend schema.graphql
const SupportedCurrencies = {
  USD: 'USD',
  JPY: 'JPY',
  GBP: 'GBP',
  EUR: 'EUR',
  CAD: 'CAD',
  KRW: 'KRW',
  INR: 'INR',
  BRL: 'BRL',
  ETH: 'ETH',
  CLNY: 'CLNY',
};

const XDAI_TOKEN = {
  /*
   * Needs to be this exact name, otherwise Metamask marks it as "not valid" when adding it
   */
  name: 'xDAI Token', //
  /*
   * Needs to be this exact name, otherwise Metamask marks it as "not valid" when adding it
   */
  symbol: 'xDAI',
  decimals: 18,
};

const ETHER_TOKEN = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};

const GOERLI_TOKEN = {
  name: 'Goerli Ether',
  symbol: 'GOETH',
  decimals: 18,
};

const POLYGON_TOKEN = {
  name: 'Matic Token',
  symbol: 'MATIC',
  decimals: 18,
};

const Tokens = {
  ETHER: ETHER_TOKEN,
  XDAI: XDAI_TOKEN,
  GOERLI: GOERLI_TOKEN,
  POLYGON: POLYGON_TOKEN,
};

const GNOSIS_NETWORK = {
  name: 'Gnosis Chain',
  chainId: '100',
  shortName: 'xDai',
  displayENSDomain: 'joincolony.colonyxdai',
  blockExplorerName: 'Gnosisscan',
  blockExplorerUrl: 'https://gnosis.blockscout.com',
  tokenExplorerLink: 'https://gnosis.blockscout.com/tokens',
  contractAddressLink: 'https://gnosis.blockscout.com/address',
  nativeToken: Tokens.XDAI,
  blockTime: 5,
};

const ETHEREUM_NETWORK = {
  name: 'Ethereum',
  chainId: '1',
  shortName: 'ETH',
  blockExplorerName: 'Etherscan',
  blockExplorerUrl: 'https://etherscan.io',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'https://etherscan.io/tokens',
  contractAddressLink: 'https://etherscan.io/address',
  safeTxService: 'https://safe-transaction-mainnet.safe.global/api',
  rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  apiUri: 'https://api.etherscan.io/api',
  nativeToken: Tokens.ETHER,
  blockTime: 12,
};

const GOERLI_NETWORK = {
  name: 'Goerli Testnet',
  chainId: '5',
  shortName: 'Goerli',
  blockExplorerName: 'Etherscan',
  blockExplorerUrl: 'https://goerli.etherscan.io',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'https://goerli.etherscan.io/tokens',
  contractAddressLink: 'https://goerli.etherscan.io/address',
  nativeToken: Tokens.GOERLI,
  blockTime: 5,
};

const GANACHE_NETWORK = {
  name: 'Local Ganache Instance',
  chainId: '265669100',
  shortName: 'Ganache',
  blockExplorerName: 'Noexplorer',
  blockExplorerUrl: 'http://localhost',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'http://localhost',
  contractAddressLink: 'http://localhost',
  nativeToken: Tokens.ETHER,
  blockTime: 5,
};

const GANACHE_NETWORK_1 = {
  name: 'Local Proxy Chain 1',
  chainId: '265669101',
  shortName: 'Local Proxy Chain 1',
  blockExplorerName: 'Noexplorer',
  blockExplorerUrl: 'http://localhost',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'http://localhost',
  contractAddressLink: 'http://localhost',
  apiUri: 'https://api-sepolia.arbiscan.io/api',
  rpcUrl: 'http://network-contracts-remote:8545',
  nativeToken: Tokens.ETHER,
  blockTime: 5,
};

const GANACHE_NETWORK_2 = {
  name: 'Local Proxy Chain 2',
  chainId: '265669102',
  shortName: 'Local Proxy Chain 2',
  blockExplorerName: 'Noexplorer',
  blockExplorerUrl: 'http://localhost',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'http://localhost',
  contractAddressLink: 'http://localhost',
  apiUri: 'https://api-sepolia.arbiscan.io/api',
  rpcUrl: 'http://network-contracts-remote-2:8545',
  nativeToken: Tokens.ETHER,
  blockTime: 5,
};

const POLYGON_NETWORK = {
  name: 'Polygon Mainnet',
  chainId: '137',
  shortName: 'Polygon',
  blockExplorerName: 'PolygonScan',
  blockExplorerUrl: 'https://polygonscan.com',
  tokenExplorerLink: 'https://polygonscan.com/tokens',
  contractAddressLink: 'https://polygonscan.com/address',
  displayENSDomain: 'joincolony.matic',
  nativeToken: Tokens.POLYGON,
  blockTime: 3,
};

const AMOY_NETWORK = {
  name: 'Polygon Amoy Testnet',
  chainId: '80002',
  shortName: 'Amoy',
  blockExplorerName: 'OKLink',
  blockExplorerUrl: 'https://www.oklink.com/amoy',
  tokenExplorerLink: 'https://www.oklink.com/amoy/address',
  contractAddressLink: 'https://www.oklink.com/amoy/address',
  displayENSDomain: 'joincolony.matic',
  nativeToken: Tokens.POLYGON,
  blockTime: 3,
};

const ARBITRUM_NETWORK = {
  name: 'Arbitrum One',
  chainId: '42161',
  shortName: 'Arbitrum',
  blockExplorerName: 'Arbiscan',
  blockExplorerUrl: 'https://arbiscan.io',
  tokenExplorerLink: 'https://arbiscan.io/tokens',
  contractAddressLink: 'https://arbiscan.io/address',
  displayENSDomain: 'joincolony.arbitrum',
  nativeToken: Tokens.ETHER,
  blockTime: 4,
};

const ARBITRUM_SEPOLIA_NETWORK = {
  name: 'Arbitrum Sepolia Testnet',
  chainId: '421614',
  shortName: 'Arbitrum Sepolia',
  blockExplorerName: 'Sepolia Arbiscan',
  blockExplorerUrl: 'https://sepolia.arbiscan.io',
  tokenExplorerLink: 'https://sepolia.arbiscan.io/tokens',
  contractAddressLink: 'https://sepolia.arbiscan.io/address',
  displayENSDomain: 'joincolony.arbitrumsepolia',
  nativeToken: Tokens.ETHER,
  blockTime: 4,
};

const NETWORK_DATA = {
  [SupportedNetwork.Ganache]: GANACHE_NETWORK,
  [SupportedNetwork.GanacheProxy1]: GANACHE_NETWORK_1,
  [SupportedNetwork.GanacheProxy2]: GANACHE_NETWORK_2,
  [SupportedNetwork.Gnosis]: GNOSIS_NETWORK,
  [SupportedNetwork.GnosisFork]: GNOSIS_NETWORK,
  [SupportedNetwork.Goerli]: GOERLI_NETWORK,
  [SupportedNetwork.Mainnet]: ETHEREUM_NETWORK,
  [SupportedNetwork.Polygon]: POLYGON_NETWORK,
  [SupportedNetwork.Amoy]: AMOY_NETWORK,
  [SupportedNetwork.ArbitrumOne]: ARBITRUM_NETWORK,
  [SupportedNetwork.ArbitrumSepolia]: ARBITRUM_SEPOLIA_NETWORK,
};

const TOKEN_DATA = Object.fromEntries(
  Object.entries(NETWORK_DATA).map(([network, config]) => [
    network,
    config.nativeToken,
  ]),
);

const CHAIN_ID_TO_SUPPORTED_NETWORK = Object.fromEntries(
  Object.entries(NETWORK_DATA).map(([network, config]) => [
    parseInt(config.chainId, 10),
    network,
  ]),
);

const coinGeckoMappings = {
  // This is a map between our internal reference to a supported currency, and the reference the api uses.
  // For full list: https://api.coingecko.com/api/v3/simple/supported_vs_currencies
  currencies: {
    [SupportedCurrencies.USD]: 'usd',
    [SupportedCurrencies.JPY]: 'jpy',
    [SupportedCurrencies.GBP]: 'gbp',
    [SupportedCurrencies.EUR]: 'eur',
    [SupportedCurrencies.CAD]: 'cad',
    [SupportedCurrencies.KRW]: 'krw',
    [SupportedCurrencies.INR]: 'inr',
    [SupportedCurrencies.BRL]: 'brl',
    [SupportedCurrencies.ETH]: 'eth',
  },
  chains: {
    [SupportedNetwork.Amoy]: 'polygon-pos',
    [SupportedNetwork.ArbitrumOne]: 'arbitrum-one',
    [SupportedNetwork.ArbitrumSepolia]: 'arbitrum-one',
    [SupportedNetwork.Ganache]: 'arbitrum-one',
    [SupportedNetwork.GanacheProxy1]: 'arbitrum-one',
    [SupportedNetwork.GanacheProxy2]: 'arbitrum-one',
    [SupportedNetwork.Gnosis]: 'xdai',
    [SupportedNetwork.GnosisFork]: 'xdai',
    [SupportedNetwork.Goerli]: 'ethereum',
    [SupportedNetwork.Mainnet]: 'ethereum',
    [SupportedNetwork.Polygon]: 'polygon-pos',
  },
  networkTokens: {
    [ETHER_TOKEN.symbol]: 'ethereum',
    [XDAI_TOKEN.symbol]: 'xdai',
  },
};

module.exports = {
  moveFundsActionTypes,
  paymentActionTypes,
  acceptedColonyActionTypes,
  DEFAULT_TOKEN_DECIMALS,
  TimeframeType,
  ColonyJSNetworkMapping,
  SupportedNetwork,
  SupportedCurrencies,
  CHAIN_ID_TO_SUPPORTED_NETWORK,
  NETWORK_DATA,
  TOKEN_DATA,
  coinGeckoMappings,
};
