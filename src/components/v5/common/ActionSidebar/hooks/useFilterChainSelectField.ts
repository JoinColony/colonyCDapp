import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetProxyColoniesQuery } from '~gql';

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

  const filterFn = (chainId) =>
    isRemoveOperation
      ? activeProxyColoniesChainIds.includes(chainId.toString())
      : !activeProxyColoniesChainIds.includes(chainId.toString());
  return filterFn;
};
