import { useDeployedChainIds } from '~hooks/proxyColonies/useDeployedChainIds.ts';

import {
  MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
  ManageEntityOperation,
} from '../consts.ts';

import { useCheckOperationType } from './useCheckOperationType.ts';

export const useFilterChainSelectField = () => {
  const isRemoveOperation = useCheckOperationType(
    MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
    ManageEntityOperation.Remove,
  );

  const activeProxyColoniesChainIds = useDeployedChainIds({
    filterFn: (deployedProxyColony) => deployedProxyColony?.isActive,
  });

  const filterFn = (chainId) =>
    isRemoveOperation
      ? activeProxyColoniesChainIds.includes(chainId.toString())
      : !activeProxyColoniesChainIds.includes(chainId.toString());
  return filterFn;
};
