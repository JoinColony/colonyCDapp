import { useMemo } from 'react';

import { SUPPORTED_CHAINS } from '~constants/proxyColonies.ts';
import { useGetSupportedChainsQuery } from '~gql';
import GanacheIcon from '~icons/GanacheIcon.tsx';
import { notNull } from '~utils/arrays/index.ts';
import {
  type IconOption,
  type SearchSelectOption,
} from '~v5/shared/SearchSelect/types.ts';

export interface IUseChainOptions {
  filterOptionsFn?: (options: SearchSelectOption<IconOption>) => boolean;
}

export const useChainOptions = (args: IUseChainOptions = {}) => {
  const { filterOptionsFn } = args;

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
      .filter((option) => (filterOptionsFn ? filterOptionsFn(option) : true));
  }, [data, filterOptionsFn]);

  return chainOptions;
};
