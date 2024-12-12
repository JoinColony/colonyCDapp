import React, { useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import Select from '~v5/common/Fields/Select/Select.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { SUPPORTED_CHAINS_OPTIONS } from './constants.ts';

export const TmpProxyColonyDeploy = () => {
  const { colony } = useColonyContext();
  const [chainId, setChainId] = useState<number | undefined>(undefined);

  const createProxyColony = useAsyncFunction({
    submit: ActionTypes.PROXY_COLONY_CREATE,
    error: ActionTypes.PROXY_COLONY_CREATE_ERROR,
    success: ActionTypes.PROXY_COLONY_CREATE_SUCCESS,
  });

  const handleClick = async () => {
    await createProxyColony({
      colonyAddress: colony.colonyAddress,
      createdAtBlock: colony.createdAtBlock,
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
    </div>
  );
};
