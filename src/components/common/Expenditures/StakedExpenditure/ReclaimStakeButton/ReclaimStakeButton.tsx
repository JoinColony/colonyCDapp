import React from 'react';
import { ExpenditureType } from '~gql';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { Expenditure } from '~types';

interface ReclaimStakeButtonProps {
  expenditure: Expenditure;
}

const ReclaimStakeButton = ({ expenditure }: ReclaimStakeButtonProps) => {
  if (
    expenditure.metadata?.type !== ExpenditureType.Staked ||
    expenditure.hasReclaimedStake
  ) {
    return null;
  }

  return (
    <ActionButton actionType={ActionTypes.RECLAIM_EXPENDITURE_STAKE}>
      Reclaim stake
    </ActionButton>
  );
};

export default ReclaimStakeButton;
