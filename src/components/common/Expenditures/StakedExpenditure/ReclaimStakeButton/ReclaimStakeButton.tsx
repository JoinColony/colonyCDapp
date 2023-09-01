import React from 'react';

import { ExpenditureStatus, ExpenditureType } from '~gql';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { Colony, Expenditure } from '~types';
import { mapPayload, pipe, withMeta } from '~utils/actions';

const allowedStatuses = [
  ExpenditureStatus.Cancelled,
  ExpenditureStatus.Finalized,
];

interface ReclaimStakeButtonProps {
  colony: Colony;
  expenditure: Expenditure;
}

const ReclaimStakeButton = ({
  colony,
  expenditure,
}: ReclaimStakeButtonProps) => {
  if (
    expenditure.metadata?.type !== ExpenditureType.Staked ||
    expenditure.hasReclaimedStake ||
    !allowedStatuses.includes(expenditure.status)
  ) {
    return null;
  }

  const transform = pipe(
    mapPayload(() => ({
      colonyAddress: colony.colonyAddress,
      nativeExpenditureId: expenditure.nativeId,
    })),
    withMeta({}),
  );

  return (
    <ActionButton
      actionType={ActionTypes.RECLAIM_EXPENDITURE_STAKE}
      transform={transform}
    >
      Reclaim stake
    </ActionButton>
  );
};

export default ReclaimStakeButton;
