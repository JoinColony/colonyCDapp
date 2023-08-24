import React from 'react';

import { ExpenditureStatus } from '~gql';
import { useCurrentBlockTime } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { Colony, Expenditure } from '~types';

interface ExpenditureClaimButtonProps {
  colony: Colony;
  expenditure: Expenditure;
}

const ExpenditureClaimButton = ({
  colony,
  expenditure,
}: ExpenditureClaimButtonProps) => {
  const currentBlockTime = useCurrentBlockTime();

  if (expenditure.status !== ExpenditureStatus.Finalized || !currentBlockTime) {
    return null;
  }

  const isFullyClaimed = !!expenditure.balances?.every(
    (balance) => balance.amount === '0',
  );

  if (isFullyClaimed) {
    return <div>There are no more payouts to claim</div>;
  }

  let nextClaimableAt: number | null = null;
  const claimableSlots = expenditure.slots.filter((slot) => {
    const claimableFrom = new Date(
      ((expenditure.finalizedAt ?? 0) + (slot.claimDelay ?? 0)) * 1000,
    ).getTime();

    if (currentBlockTime >= claimableFrom) {
      return true;
    }

    if (!nextClaimableAt || claimableFrom < nextClaimableAt) {
      nextClaimableAt = claimableFrom;
    }

    return false;
  });

  return (
    <div>
      <div>You can now claim {claimableSlots.length} slots</div>
      {nextClaimableAt && (
        <div>Next claim at {new Date(nextClaimableAt).toString()}</div>
      )}

      {claimableSlots.length > 0 && (
        <ActionButton
          actionType={ActionTypes.EXPENDITURE_CLAIM}
          values={{
            colonyAddress: colony.colonyAddress,
            expenditure,
          }}
        >
          Claim funds
        </ActionButton>
      )}
    </div>
  );
};

export default ExpenditureClaimButton;
