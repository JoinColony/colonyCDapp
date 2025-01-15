import { useMemo } from 'react';

import { SUPPORTED_CHAINS } from '~constants/proxyColonies.ts';

export const useChainOptions = (filterOptionsFn) => {
  const chainOptions = useMemo(
    () =>
      SUPPORTED_CHAINS.map(({ icon, chainId, name, isDisabled }) => ({
        icon,
        isDisabled,
        value: chainId,
        label: name,
      })).filter((option) => filterOptionsFn && filterOptionsFn(option)),
    [filterOptionsFn],
  );

  return chainOptions;
};
