import { useMemo } from 'react';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { SUPPORTED_CHAINS } from '~constants/proxyColonies.ts';
import { useGetSupportedChainsQuery } from '~gql';
import GanacheIcon from '~icons/GanacheIcon.tsx';
import { notNull } from '~utils/arrays/index.ts';

const DEFAULT_NETWORK_OPTION = {
  icon: DEFAULT_NETWORK_INFO.icon ?? GanacheIcon,
  isDisabled: false,
  value: DEFAULT_NETWORK_INFO.chainId,
  label: DEFAULT_NETWORK_INFO.shortName,
};

// This also gets the default chain and inserts it as the first option
export const useChainOptions = (filterOptionsFn) => {
  const { data } = useGetSupportedChainsQuery();

  const chainOptions = useMemo(() => {
    const supportedChainOptions = (data?.listSupportedChains?.items ?? [])
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
      .filter(notNull);

    return [DEFAULT_NETWORK_OPTION, ...supportedChainOptions].filter(
      (option) => (filterOptionsFn ? filterOptionsFn(option) : true),
    );
  }, [data, filterOptionsFn]);

  return chainOptions;
};
