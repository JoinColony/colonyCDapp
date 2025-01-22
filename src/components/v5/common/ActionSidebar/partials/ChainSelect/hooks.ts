import { useMemo } from 'react';

import { SUPPORTED_CHAINS } from '~constants/proxyColonies.ts';
import { useGetSupportedChainsQuery } from '~gql';
import GanacheIcon from '~icons/GanacheIcon.tsx';
import { notNull } from '~utils/arrays/index.ts';

export const useChainOptions = (filterOptionsFn) => {
  const { data } = useGetSupportedChainsQuery();

  const chainOptions = useMemo(() => {
    return (data?.listSupportedChains?.items ?? [])
      .map((chain) => {
        const chainConfig = SUPPORTED_CHAINS.find(
          (supportedChain) => supportedChain.chainId === chain?.id,
        );
        if (!chainConfig) {
          return null;
        }

        return {
          icon: chainConfig.icon ?? GanacheIcon,
          isDisabled: !chain?.isActive,
          value: chainConfig.chainId,
          label: chainConfig.shortName,
        };
      })
      .filter(notNull)
      .filter((option) => filterOptionsFn && filterOptionsFn(option));
  }, [data, filterOptionsFn]);

  return chainOptions;
};
