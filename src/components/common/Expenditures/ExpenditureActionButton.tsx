import React from 'react';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { mapPayload, pipe, withMeta } from '~utils/actions';

const ExpenditureActionButton = () => {
  const navigate = useNavigate();

  const { colony } = useColonyContext();

  const { recipientAddress, tokenAddress, amount } = useWatch();

  if (!colony) {
    return null;
  }

  const transform = pipe(
    mapPayload(() => ({
      colonyName: colony.name,
      colonyAddress: colony.colonyAddress,
      recipientAddress,
      tokenAddress,
      amount,
    })),
    withMeta({ navigate }),
  );

  return (
    <ActionButton
      actionType={ActionTypes.EXPENDITURE_CREATE}
      transform={transform}
    >
      Create expenditure
    </ActionButton>
  );
};

export default ExpenditureActionButton;
