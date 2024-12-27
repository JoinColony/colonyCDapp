import { useWatch } from 'react-hook-form';

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

export const useFilterChainSelectField = () => {
  const operation = useWatch({ name: MANAGE_SUPPORTED_CHAINS_FIELD_NAME });

  const { colony } = useColonyContext();
  const { data } = useGetProxyColoniesQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
  });
  const deployedProxyColonies =
    data?.getProxyColoniesByColonyAddress?.items || [];
  const activeProxyColoniesChainIds = deployedProxyColonies
    .filter((deployedProxyColony) => deployedProxyColony?.isActive)
    .map((deployedProxyColony) => deployedProxyColony?.chainId);

  const filterFn = ({ value: chainId }: SearchSelectOption<IconOption>) =>
    operation && operation === ManageEntityOperation.Add
      ? !activeProxyColoniesChainIds.includes(chainId.toString())
      : activeProxyColoniesChainIds.includes(chainId.toString());

  return filterFn;
};
