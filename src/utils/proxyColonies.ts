import { SUPPORTED_CHAINS } from '~constants/proxyColonies.ts';

import { isNil } from './lodash.ts';

export const findSupportedChain = (chainId: number | undefined | null) => {
  if (isNil(chainId)) {
    return null;
  }
  return SUPPORTED_CHAINS.find(
    (supportedChain) => supportedChain.chainId === chainId,
  );
};
