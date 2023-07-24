import React from 'react';
import { useWatch } from 'react-hook-form';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';

const ExpenditureActionButton = () => {
  const { colony } = useColonyContext();

  const { recipientAddress, tokenAddress, amount } = useWatch();

  if (!colony) {
    return null;
  }

  return (
    <ActionButton
      actionType={ActionTypes.EXPENDITURE_CREATE}
      values={{
        colonyAddress: colony.colonyAddress,
        recipientAddress,
        tokenAddress,
        amount,
      }}
    >
      Create expenditure
    </ActionButton>
  );
};

export default ExpenditureActionButton;
