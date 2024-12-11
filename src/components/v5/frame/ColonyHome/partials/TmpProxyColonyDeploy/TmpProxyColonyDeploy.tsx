import React, { useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetProxyColoniesQuery } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import Select from '~v5/common/Fields/Select/Select.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { SUPPORTED_CHAINS_OPTIONS } from './constants.ts';

export const TmpProxyColonyDeploy = () => {
  const { colony } = useColonyContext();
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const proxyColoniesResponse = useGetProxyColoniesQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
    },
  });

  const createProxyColony = useAsyncFunction({
    submit: ActionTypes.PROXY_COLONY_CREATE,
    error: ActionTypes.PROXY_COLONY_CREATE_ERROR,
    success: ActionTypes.PROXY_COLONY_CREATE_SUCCESS,
  });

  const handleClick = async () => {
    if (!colony.colonyCreateEvent) {
      console.warn('No colony creation data');
      return;
    }

    await createProxyColony({
      colonyAddress: colony.colonyAddress,
      signerAddress: colony.colonyCreateEvent.signerAddress,
      blockNumber: colony.colonyCreateEvent.blockNumber,
      foreignChainId: chainId,
    });
  };

  return (
    <div className="flex-row items-start gap-2">
      <Select
        options={SUPPORTED_CHAINS_OPTIONS}
        value={chainId}
        onChange={(option) => {
          setChainId(option?.value ? Number(option.value) : undefined);
        }}
      />
      <Button onClick={handleClick} disabled={!chainId}>
        Create proxy colony
      </Button>
      <ul>
        {proxyColoniesResponse.data?.getProxyColoniesByColonyAddress?.items.map(
          (proxyColony) => {
            return (
              <li key={proxyColony?.id}>
                Status on chain {proxyColony?.chainId}:
                {proxyColony?.isActive ? 'deployed' : 'not deployed'}
              </li>
            );
          },
        )}
      </ul>
    </div>
  );
};
