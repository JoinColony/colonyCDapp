import { GNOSIS_AMB_BRIDGES } from '~constants/index.ts';

export const FEEDBACK = `https://news.colony.io/ideas/en`;
export const COLONY_DEV_DOCS = `https://docs.colony.io/develop`;
export const COLONY_DISCORD = `https://discord.gg/feVZWwysqM`;
export const COLONY_DOCS = `https://docs.colony.io/`;
export const COLONY_GITHUB = `https://github.com/joincolony`;
export const COLONY_TWITTER = `https://twitter.com/joincolony`;
export const FEATURES_BUGS = `https://news.colony.io/ideas/en`;
export const WHATS_NEW = `https://news.colony.io/en`;
export const HELP = `https://docs.colony.io/colonynetwork/tldr/colony/`;
export const BETA_DISCLAIMER = `https://docs.colony.io/use/beta/`;
export const PRIVACY_POLICY = `https://colony.io/terms-of-service#privacy-policy`;
export const TERMS_AND_CONDITIONS = `https://colony.io/terms-of-service`;
export const ADVANCED_SETTINGS = `https://docs.colony.io/use/advanced-features/`;
export const REQUEST_ACCESS = `https://colony.io/request-access`;

/*
 * Utils
 */
export const TOKEN_LOGOS_REPO = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains`;
export const NETWORK_RELEASES = `https://github.com/JoinColony/colonyNetwork/releases/tag`;
export const ETHERSCAN_CONVERSION_RATE = `https://api.etherscan.io/api?module=stats&action=ethprice`;
export const ETH_GAS_STATION = `https://ethgasstation.info/json/ethgasAPI.json`;
export const XDAI_GAS_STATION = `https://gnosis.blockscout.com/api/v1/gas-price-oracle`;
export const getBlockscoutUserURL = (userAddress: string) =>
  `https://gnosis.blockscout.com/address/${userAddress}`;

/*
 * Motions and Disputes
 */
export const MD_OBJECTIONS_HELP = `https://colony.io/dev/docs/colonynetwork/whitepaper-tldr-objections-and-disputes#objections`;
export const MD_REPUTATION_INFO = `https://docs.colony.io/use/reputation/`;

/*
 * Token
 */
export const TOKEN_ACTIVATION_INFO = `https://docs.colony.io/use/managing-funds/token-activation/`;
export const TOKEN_UNLOCK_INFO = `https://docs.colony.io/use/managing-funds/unlock-token/`;
export const SELECT_NATIVE_TOKEN_INFO = `https://docs.colony.io/use/launch-a-colony#step-2-setup-your-token`;

/*
 * Recovery Mode
 */
export const RECOVERY_HELP = `https://docs.colony.io/use/advanced-features/recovery-mode/`;

/*
 * Reputation & Smite
 */
export const REPUTATION_LEARN_MORE = `https://docs.colony.io/use/reputation/award-reputation/`;

/*
 * Metatransactions
 */
export const METATRANSACTIONS_LEARN_MORE = `https://docs.colony.io/use/advanced-features/gasless-transactions`;

/*
 *  Supporting documents
 */
export const LAZY_CONSENSUS = `https://docs.colony.io/learn/governance/lazy-consensus`;
export const LAZY_CONSENSUS_EXTENSION = `https://docs.colony.io/use/governance/motions-and-disputes`;
export const PAYMENTS = `https://docs.colony.io/use/making-payments/payments`;
export const STREAMING_PAYMENTS = `https://docs.colony.io/use/making-payments/streaming-payments`;
export const PERMISSIONS = `https://docs.colony.io/learn/advanced-concepts/permissions`;
export const MULTI_SIG_EXTENSION = `https://blog.colony.io/new-feature-fully-control-a-multi-sig-safe-with-a-dao/`;
export const MULTI_SIG_HELP_URL =
  'https://help.colony.io/en/articles/9619272-multi-sig-permissions#h_3d3820ca17';
export const STAKING_ADVANCED_PAYMENTS = `https://help.colony.io/en/articles/9626933-staking-advanced-payments`;
export const STAGED_PAYMENTS = `https://help.colony.io/en/articles/9626927-staged-payments`;

/*
 * Navigation
 */
export const LEARN_MORE_PAYMENTS = `https://docs.colony.io/use/making-payments/payments`;
export const LEARN_MORE_DECISIONS = `https://docs.colony.io/use/decisions`;
export const LEARN_MORE_ADMIN = `https://docs.colony.io/use/admin`;
export const LEARN_MORE_COLONY_HELP_GENERAL = `https://help.colony.io/`;
/*
 * Safe Control
 */
export const ADD_SAFE_INSTRUCTIONS = `https://docs.colony.io/use/managing-funds/gnosis-safe-control/adding-a-safe`;

export const CONNECT_SAFE_INSTRUCTIONS = `https://docs.colony.io/use/managing-funds/gnosis-safe-control/adding-a-safe#step-2-connect-the-safe`;

const SAFE_APP = `https://app.safe.global`;

export const getSafeLink = (chainShortName: string, safeAddress: string) =>
  `${SAFE_APP}/${chainShortName}:${safeAddress}`;

export const getModuleLink = (chainShortName: string, safeAddress: string) =>
  `${getSafeLink(
    chainShortName,
    safeAddress,
  )}/apps?appUrl=https%3A%2F%2Fzodiac.gnosisguild.org%2F`;

export const MODULE_ADDRESS_INSTRUCTIONS = `https://docs.colony.io/use/managing-funds/gnosis-safe-control/adding-a-safe#finding-the-module-contract-address`;

export const SAFE_CONTROL_LEARN_MORE = `https://docs.colony.io/use/managing-funds/gnosis-safe-control/#how-it-all-works`;

export const SAFE_INTEGRATION_LEARN_MORE = `https://docs.colony.io/use/managing-funds/gnosis-safe-control/controlling-a-safe`;

export const getSafeTransactionMonitor = (
  chainId: string,
  transactionHash: string,
) => {
  const monitorUrl = GNOSIS_AMB_BRIDGES[chainId].monitor;

  return `${monitorUrl}100/${transactionHash}`;
};

/**
 * Crypto to Fiat
 */
export const LEARN_MORE_CRYPTO_TO_FIAT =
  'https://help.colony.io/en/articles/9529993-crypto-to-fiat#h_af81098357';
