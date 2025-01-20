import { useDeployedChainIds } from '~hooks/proxyColonies/useDeployedChainIds.ts';
import {
  type SearchSelectOption,
  type IconOption,
} from '~v5/shared/SearchSelect/types.ts';

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

  const filterFn = ({ value: chainId }: SearchSelectOption<IconOption>) =>
    isRemoveOperation
      ? activeProxyColoniesChainIds.includes(chainId.toString())
      : !activeProxyColoniesChainIds.includes(chainId.toString());
  return filterFn;
};
