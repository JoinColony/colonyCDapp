import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type ProxyColony, useGetProxyColoniesQuery } from '~gql';
import { notNull } from '~utils/arrays/index.ts';

export const useDeployedChainIds = ({
  filterFn = notNull,
}: {
  filterFn: (x: ProxyColony) => boolean;
}) => {
  const { colony } = useColonyContext();
  const { data } = useGetProxyColoniesQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
    fetchPolicy: 'network-only',
  });
  const deployedProxyColonies =
    data?.getProxyColoniesByColonyAddress?.items || [];
  const deployedChainIds = deployedProxyColonies
    .filter(filterFn)
    .map((deployedProxyColony) => deployedProxyColony?.chainId);

  return deployedChainIds;
};
