import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { supportedChainsConfig } from '~constants/chains.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetProxyColoniesQuery } from '~gql';
import {
  MANAGE_SUPPORTED_CHAINS_FIELD_NAME,
  ManageEntityOperation,
} from '~v5/common/ActionSidebar/consts.ts';

export const useAvailableChains = () => {
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
    .filter(
      (deployedProxyColony) =>
        deployedProxyColony && deployedProxyColony?.isActive,
    )
    .map((deployedProxyColony) => deployedProxyColony?.chainId);

  const stringifiedActiveProxyColoniesChainIds = JSON.stringify(
    activeProxyColoniesChainIds,
  );

  const availableChains = useMemo(
    () =>
      supportedChainsConfig
        .filter((supportedChainConfig) =>
          operation === ManageEntityOperation.Add
            ? !activeProxyColoniesChainIds.includes(
                supportedChainConfig.chainId.toString(),
              )
            : activeProxyColoniesChainIds.includes(
                supportedChainConfig.chainId.toString(),
              ),
        )
        .map((supportedChainConfig) => ({
          icon: supportedChainConfig.icon,
          value: supportedChainConfig.chainId,
          label: supportedChainConfig.name,
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [operation, stringifiedActiveProxyColoniesChainIds],
  );

  return availableChains;
};
