import { SUPPORTED_CHAINS } from '~constants/proxyColonies.ts';

export const SUPPORTED_CHAINS_OPTIONS = SUPPORTED_CHAINS.map(
  (supportedChain) => ({
    value: supportedChain.chainId,
    label: supportedChain.name,
  }),
);
