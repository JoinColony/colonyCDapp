import { constants as ethersContants } from 'ethers';

import { version } from '../../package.json';

import { Network } from '~types';

export * from './externalUrls';
export * from './extensions';

export type TokenInfo = {
  name: string;
  symbol: string;
  decimals?: number;
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
  iconName?: string;
};

export const DEFAULT_NETWORK = process.env.NETWORK || Network.Ganache;
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

export const GNOSIS_NETWORK: NetworkInfo = {
  name: 'Gnosis Chain',
  chainId: 100,
  shortName: 'xDai',
  displayENSDomain: 'joincolony.colonyxdai',
  blockExplorerName: 'Gnosisscan',
  blockExplorerUrl: 'https://blockscout.com/poa/xdai',
  tokenExplorerLink: 'https://blockscout.com/poa/xdai/tokens',
  contractAddressLink: 'https://blockscout.com/poa/xdai/address',
  iconName: 'gnosis',
};

export const ETHEREUM_NETWORK: NetworkInfo = {
  name: 'Ethereum',
  chainId: 1,
  shortName: 'Mainnet',
  blockExplorerName: 'Etherscan',
  blockExplorerUrl: 'https://etherscan.io',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'https://etherscan.io/tokens',
  contractAddressLink: 'https://etherscan.io/address',
  iconName: 'ethereum-icon',
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
  iconName: 'ganache',
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
  process.env.GANACHE_RPC_URL || 'http://localhost:8545/';

export const isDev = process.env.NETWORK === 'ganache';

export const CDAPP_VERSION = version;

export const MAX_INSTALLED_NUMBER = 39;

export const STAKING_THRESHOLD = 10;

export const VERIFIED_MEMBERS_LIST_LIMIT = 10;
export const HOMEPAGE_MEMBERS_LIST_LIMIT = 8;
export const HOMEPAGE_MOBILE_MEMBERS_LIST_LIMIT = 5;
export const MEMBERS_LIST_LIMIT = 12;
export const MEMBERS_MOBILE_LIST_LIMIT = 6;

export const MAX_COLONY_DISPLAY_NAME = 20;

export const MAX_DOMAIN_PURPOSE_LENGTH = 90;

export const MAX_ANNOTATION_LENGTH = 4000;

export const MIN_VOTING_REPUTATION_VERSION_FOR_DECISIONS = 7;

export const ACTION_DECISION_MOTION_CODE = '0x12345678';

export const VOTING_THRESHOLD = 40;
