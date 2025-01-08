import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetProxyColoniesQuery } from '~gql';
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

  const { colony } = useColonyContext();
  const { data } = useGetProxyColoniesQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
    fetchPolicy: 'cache-and-network',
  });
  const deployedProxyColonies =
    data?.getProxyColoniesByColonyAddress?.items || [];
  const activeProxyColoniesChainIds = deployedProxyColonies
    .filter((deployedProxyColony) => deployedProxyColony?.isActive)
    .map((deployedProxyColony) => deployedProxyColony?.chainId);

  const filterFn = ({ value: chainId }: SearchSelectOption<IconOption>) =>
    isRemoveOperation
      ? activeProxyColoniesChainIds.includes(chainId.toString())
      : !activeProxyColoniesChainIds.includes(chainId.toString());
  return filterFn;
};
