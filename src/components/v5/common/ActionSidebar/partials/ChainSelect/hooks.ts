import { useMemo } from 'react';

import { DEFAULT_CHAIN_CONFIG, type IChainConfig } from '~constants';
import { SUPPORTED_CHAINS } from '~constants/proxyColonies.ts';
import { useGetSupportedChainsQuery } from '~gql';
import { useDeployedChainIds } from '~hooks/proxyColonies/useDeployedChainIds.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  type IconOption,
  type SearchSelectOption,
} from '~v5/shared/SearchSelect/types.ts';

export interface IUseChainOptions {
  filterOptionsFn?: (options: SearchSelectOption<IconOption>) => boolean;
  onlyShowActiveChains?: boolean;
  includeDefaultChain?: boolean;
}

export const useChainOptions = (args: IUseChainOptions = {}) => {
  const { filterOptionsFn, includeDefaultChain, onlyShowActiveChains } = args;

  const deployedChainIds = useDeployedChainIds({
    filterFn: (deployedProxyColony) => deployedProxyColony?.isActive,
    skip: !onlyShowActiveChains,
  });

  const { data } = useGetSupportedChainsQuery();

  const supportedChains = data?.listSupportedChains?.items;

  const chainOptions = useMemo(() => {
    if (!supportedChains) {
      return [];
    }

    let options: IChainConfig[] = supportedChains
      .map((chain) => {
        const chainConfig = SUPPORTED_CHAINS.find(
          (supportedChain) => supportedChain.chainId === chain?.id,
        );

        if (!chainConfig) {
          return null;
        }

        return {
          icon: chainConfig.icon ?? DEFAULT_CHAIN_CONFIG.icon,
          isDisabled: !chain?.isActive,
          value: chainConfig.chainId,
          label: chainConfig.shortName,
        };
      })
      .filter(notNull);

    if (onlyShowActiveChains) {
      options = options.filter(({ value }) => deployedChainIds.includes(value));
    }

    if (filterOptionsFn) {
      options = options.filter((option) => filterOptionsFn(option));
    }

    return [...options, ...(includeDefaultChain ? [DEFAULT_CHAIN_CONFIG] : [])];
  }, [
    deployedChainIds,
    filterOptionsFn,
    includeDefaultChain,
    onlyShowActiveChains,
    supportedChains,
  ]);

  return chainOptions;
};
