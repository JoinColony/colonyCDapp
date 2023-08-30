import React from 'react';
import { ExpenditureStatus, ExpenditureType } from '~gql';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { Colony, Expenditure } from '~types';
import { pipe, withMeta } from '~utils/actions';

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

  const transform = pipe(withMeta({}));

  return (
    <ActionButton
      actionType={ActionTypes.RECLAIM_EXPENDITURE_STAKE}
      values={{
        colonyAddress: colony.colonyAddress,
        nativeExpenditureId: expenditure.nativeId,
      }}
      transform={transform}
    >
      Reclaim stake
    </ActionButton>
  );
};

export default ReclaimStakeButton;
