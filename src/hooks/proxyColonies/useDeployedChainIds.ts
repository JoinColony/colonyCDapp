import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetProxyColoniesQuery, type ProxyColony } from '~gql';
import { notNull } from '~utils/arrays/index.ts';

export const useDeployedChainIds = ({
  filterFn = notNull,
  skip = false,
}: {
  filterFn: (x: ProxyColony) => boolean;
  skip?: boolean;
}) => {
  const { colony } = useColonyContext();
  const { data } = useGetProxyColoniesQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
    fetchPolicy: 'network-only',
    skip,
  });
  const deployedProxyColonies =
    data?.getProxyColoniesByColonyAddress?.items || [];
  const deployedChainIds = deployedProxyColonies
    .filter(filterFn)
    .map((deployedProxyColony) => deployedProxyColony?.chainId);

  return deployedChainIds;
};
