import { type SupportedChain } from '~types/proxyColonies.ts';

// @TODO this probably needs to be setup more dynamically, but let's hardcode it for now
export const SEPOLIA_NETWORK = {
  name: 'Sepolia',
  chainId: 265669101,
};
export const OPTIMISM_SEPOLIA_NETWORK = {
  name: 'Optimism Sepolia',
  chainId: 265669102,
};

export const SUPPORTED_CHAINS: SupportedChain[] = [
  SEPOLIA_NETWORK,
  OPTIMISM_SEPOLIA_NETWORK,
];
