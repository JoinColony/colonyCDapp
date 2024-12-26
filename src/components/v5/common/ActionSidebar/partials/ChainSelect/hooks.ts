import { useMemo } from 'react';

import { SUPPORTED_CHAINS } from '~constants/proxyColonies.ts';

export const useChainOptions = (filterOptionsFn) => {
  const chainOptions = useMemo(
    () =>
      SUPPORTED_CHAINS.filter(
        (supportedChainConfig) =>
          filterOptionsFn && filterOptionsFn(supportedChainConfig.chainId),
      ).map(({ icon, chainId, name, isDisabled }) => ({
        icon,
        isDisabled,
        value: chainId,
        label: name,
      })),
    [filterOptionsFn],
  );

  return chainOptions;
};
