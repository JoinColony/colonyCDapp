import { type Icon } from '@phosphor-icons/react';
import { constants as ethersContants } from 'ethers';

import EthereumIcon from '~icons/EthereumIcon.tsx';
import GanacheIcon from '~icons/GanacheIcon.tsx';
import GnosisIcon from '~icons/GnosisIcon.tsx';
import { Network } from '~types/network.ts';

import { version } from '../../package.json';

export * from './externalUrls.ts';
export * from './extensions.ts';

export type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
};

export type NetworkInfo = {
  name: string;
  chainId: number;
  shortName: string;
  description?: string;
  displayENSDomain?: string;
  /**
   * Used just to display references to the current networks's
   */
  blockExplorerName?: string;
  blockExplorerUrl?: string;
  /**
   * Link to a token list from the current network's block explorer.
   * This will just be used for information messages and tooltips.
   * We actually linking to it we have a method that generates the
   * link programatically: `getBlockExplorerLink()`
   */
  tokenExplorerLink?: string;
  contractAddressLink: string;
  /*
   * Used when adding the network to Metamask
   */
  rpcUrl?: string;
  icon?: Icon;
  /*
   * These props are used when interacting with the Safe Control dialogs
   */
  safeTxService?: string;
  apiUri?: string;
  nativeToken?: TokenInfo;
  blockTime?: number;
};

export const DEFAULT_NETWORK = import.meta.env.VITE_NETWORK || Network.Ganache;
export const COLONY_TOTAL_BALANCE_DOMAIN_ID = 0;
export const DEFAULT_TOKEN_DECIMALS = 18;

export const XDAI_TOKEN: TokenInfo = {
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

export const ETHER_TOKEN: TokenInfo = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};

export const GOERLI_TOKEN: TokenInfo = {
  name: 'Goerli Ether',
  symbol: 'GOETH',
  decimals: 18,
};

const BINANCE_TOKEN: TokenInfo = {
  name: 'Binance',
  symbol: 'BNB',
  decimals: 18,
};

export const GNOSIS_NETWORK: NetworkInfo = {
  name: 'Gnosis Chain',
  chainId: 100,
  shortName: 'xDai',
  displayENSDomain: 'joincolony.colonyxdai',
  blockExplorerName: 'Gnosisscan',
  blockExplorerUrl: 'https://gnosis.blockscout.com/',
  tokenExplorerLink: 'https://gnosis.blockscout.com/tokens',
  contractAddressLink: 'https://gnosis.blockscout.com/address',
  icon: GnosisIcon,
  blockTime: 5,
};

export const ETHEREUM_NETWORK: NetworkInfo = {
  name: 'Ethereum',
  chainId: 1,
  shortName: 'ETH',
  blockExplorerName: 'Etherscan',
  blockExplorerUrl: 'https://etherscan.io',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'https://etherscan.io/tokens',
  contractAddressLink: 'https://etherscan.io/address',
  icon: EthereumIcon,
  safeTxService: 'https://safe-transaction-mainnet.safe.global/api',
  rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  apiUri: 'https://api.etherscan.io/api',
  nativeToken: ETHER_TOKEN,
  blockTime: 12,
};

export const GOERLI_NETWORK: NetworkInfo = {
  name: 'Goerli Testnet',
  chainId: 5,
  shortName: 'Goerli',
  blockExplorerName: 'Etherscan',
  blockExplorerUrl: 'https://goerli.etherscan.io',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'https://goerli.etherscan.io/tokens',
  contractAddressLink: 'https://goerli.etherscan.io/address',
  nativeToken: GOERLI_TOKEN,
  blockTime: 5,
};

export const GANACHE_NETWORK: NetworkInfo = {
  name: 'Local Ganache Instance',
  chainId: 2656691,
  shortName: 'Ganache',
  blockExplorerName: 'Noexplorer',
  blockExplorerUrl: 'http://localhost',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'http://localhost',
  contractAddressLink: 'http://localhost',
  icon: GanacheIcon,
  nativeToken: ETHER_TOKEN,
  blockTime: 5,
};

export const BINANCE_NETWORK: NetworkInfo = {
  name: 'Binance Smart Chain',
  chainId: 56,
  shortName: 'BNB',
  contractAddressLink: '',
  safeTxService: 'https://safe-transaction-bsc.safe.global/api',
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  apiUri: 'https://api.bscscan.com/api',
  nativeToken: BINANCE_TOKEN,
  blockTime: 3,
};

export const NETWORK_DATA: { [key: string]: NetworkInfo } = {
  [Network.Ganache]: GANACHE_NETWORK,
  [Network.Gnosis]: GNOSIS_NETWORK,
  [Network.GnosisFork]: GNOSIS_NETWORK,
  [Network.Goerli]: GOERLI_NETWORK,
  [Network.Mainnet]: ETHEREUM_NETWORK,
};

export const TOKEN_DATA = {
  [Network.Ganache]: ETHER_TOKEN,
  [Network.Gnosis]: XDAI_TOKEN,
  [Network.GnosisFork]: XDAI_TOKEN,
  [Network.Goerli]: GOERLI_TOKEN,
  [Network.Mainnet]: ETHER_TOKEN,
};

const GAS_LIMITS = {
  [Network.Ganache]: 6_721_975, // Default ganache gas limit. To verify, run web3.eth.getBlock("latest") in truffle console and inspect "gasLimit" field.
  [Network.Gnosis]: 30_000_000, // https://docs.gnosischain.com/specs/#general-information
  [Network.Mainnet]: 30_000_000, // https://ethereum.org/en/developers/docs/blocks/#:~:text=Each%20block%20has%20a%20target,(2x%20target%20block%20size).
};

export const DEFAULT_GAS_LIMIT: number =
  GAS_LIMITS[DEFAULT_NETWORK] ?? 30_000_000;

/*
 * Chains on which the network contracts are deployed
 * Since CDapp is multichain, this tells us which of those "multi" chains
 * we can actually create colonies on
 */
export const NETWORK_AVAILABLE_CHAINS = {
  [Network.Ganache]: GANACHE_NETWORK,
  [Network.Gnosis]: GNOSIS_NETWORK,
};

export const DEFAULT_NETWORK_TOKEN = TOKEN_DATA[DEFAULT_NETWORK];

export const DEFAULT_NETWORK_INFO = NETWORK_DATA[DEFAULT_NETWORK];

/*
 * List all networks that curently support metatransactions
 */
export const NETWORKS_WITH_METATRANSACTIONS = [
  Network.Ganache,
  Network.Gnosis,
  Network.GnosisFork,
];

export const ADDRESS_ZERO = ethersContants.AddressZero;

export const GANACHE_LOCAL_RPC_URL =
  import.meta.env.VITE_GANACHE_RPC_URL || 'http://localhost:8545/';

export const isDev = import.meta.env.VITE_NETWORK === 'ganache';

export const CDAPP_VERSION = version;

export const EXTENSIONS_COUNT_THRESHOLD = 39;

export const STAKING_THRESHOLD = 10;

export const VERIFIED_MEMBERS_LIST_LIMIT = 10;
export const HOMEPAGE_MEMBERS_LIST_LIMIT = 12;
export const CONTRIBUTORS_MEMBERS_LIST_LIMIT = 12;
export const ALL_MEMBERS_LIST_LIMIT = 28;
export const ALL_MEMBERS_LOAD_MORE_LIST_LIMIT = 12;
export const HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT = 12;
export const MEMBERS_LIST_LIMIT = 12;
export const MEMBERS_MOBILE_LIST_LIMIT = 6;

export const MAX_COLONY_DISPLAY_NAME = 20;

export const MAX_DOMAIN_PURPOSE_LENGTH = 120;

export const MAX_ANNOTATION_LENGTH = 4000;
export const MAX_OBJECTIVE_DESCRIPTION_LENGTH = 200;

export const MIN_VOTING_REPUTATION_VERSION_FOR_DECISIONS = 7;

export const ACTION_DECISION_MOTION_CODE = '0x12345678';

export const VOTING_THRESHOLD = 40;
export const SUPPORTED_SAFE_NETWORKS: NetworkInfo[] = [
  ETHEREUM_NETWORK,
  BINANCE_NETWORK,
];

export const SAFE_NAMES_MAP = SUPPORTED_SAFE_NETWORKS.reduce(
  (acc, safe) => ({
    ...acc,
    [safe.chainId]: safe.name,
  }),
  {},
);

/*
 * "Home" here always refers to Gnosis Chain.
 * "Foreign" is the chain to which we are bridging.
 */

interface AmbBridge {
  homeAMB: string;
  foreignAMB: string;
  foreignFinalizationRate: number;
  monitor?: string;
  referenceUrl?: string;
  homeGasLimit?: number;
  foreignGasLimit?: number;
  homeFinalizationRate?: number;
}

export const GNOSIS_AMB_BRIDGES: { [x: number]: AmbBridge } = {
  [ETHEREUM_NETWORK.chainId]: {
    homeAMB: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
    foreignAMB: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
    monitor: 'https://alm-gnosis-eth.colony.io/',
    referenceUrl:
      'https://docs.tokenbridge.net/eth-xdai-amb-bridge/about-the-eth-xdai-amb',
    homeGasLimit: 2000000,
    foreignGasLimit: 2000000,
    homeFinalizationRate: 20,
    foreignFinalizationRate: 20,
  },
  [BINANCE_NETWORK.chainId]: {
    homeAMB: '0x162E898bD0aacB578C8D5F8d6ca588c13d2A383F',
    foreignAMB: '0x05185872898b6f94AA600177EF41B9334B1FA48B',
    monitor: 'https://alm-gnosis-bsc.colony.io/',
    referenceUrl:
      'https://docs.tokenbridge.net/bsc-xdai-amb/about-the-bsc-xdai-amb',
    homeGasLimit: 2000000,
    foreignGasLimit: 2000000,
    homeFinalizationRate: 20,
    foreignFinalizationRate: 12,
  },
};

export const FETCH_ABORTED = 'fetchAborted';

export const isFullScreen = 'isFullScreen';

export const APP_URL = new URL(
  import.meta.env.VITE_BASE_URL || 'http://localhost:9091',
);
