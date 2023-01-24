import { BigNumber } from 'ethers';
import React from 'react';
import { useColonyContext } from '~hooks';

import { ActionTypes } from '~redux';
import Button, { ActionButton } from '~shared/Button';

const displayName = 'Common.ColonyActions';

const ColonyActions = () => {
  const { colony } = useColonyContext();
  if (!colony) {
    return null;
  }

  return (
    <div>
      <ActionButton
        button={Button}
        submit={ActionTypes.ACTION_MINT_TOKENS}
        error={ActionTypes.ACTION_MINT_TOKENS_ERROR}
        success={ActionTypes.ACTION_MINT_TOKENS_SUCCESS}
        values={{
          colonyAddress: colony.colonyAddress,
          colonyName: colony.name,
          nativeTokenAddress: colony.nativeToken.tokenAddress,
          amount: BigNumber.from(1),
        }}
        text="Test Mint Tokens"
      />
    </div>
  );
};

ColonyActions.displayName = displayName;

export default ColonyActions;
