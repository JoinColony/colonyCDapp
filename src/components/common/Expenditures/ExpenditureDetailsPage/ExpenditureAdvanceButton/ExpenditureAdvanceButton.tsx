import React from 'react';
import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';

import { ExpenditureStatus } from '~gql';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { Colony, Expenditure } from '~types';
import { isExpenditureFunded } from '~utils/expenditures';

interface ExpenditureAdvanceButtonProps {
  expenditure: Expenditure;
  colony: Colony;
}

const getExpenditurePayoutsTotal = (expenditure: Expenditure) => {
  return expenditure.slots.reduce((total, slot) => {
    return total.add(
      slot.payouts?.reduce(
        (slotTotal, payout) => slotTotal.add(payout.amount),
        BigNumber.from(0),
      ) ?? 0,
    );
  }, BigNumber.from(0));
};

const ExpenditureAdvanceButton = ({
  expenditure,
  colony,
}: ExpenditureAdvanceButtonProps) => {
  if (expenditure.status === ExpenditureStatus.Draft) {
    return (
      <ActionButton
        actionType={ActionTypes.EXPENDITURE_LOCK}
        values={{
          colonyAddress: colony.colonyAddress,
          nativeExpenditureId: expenditure.nativeId,
        }}
      >
        Lock expenditure
      </ActionButton>
    );
  }

  if (
    expenditure.status === ExpenditureStatus.Locked &&
    !isExpenditureFunded(expenditure)
  ) {
    return (
      <ActionButton
        actionType={ActionTypes.EXPENDITURE_FUND}
        values={{
          colonyAddress: colony.colonyAddress,
          fromDomainFundingPotId:
            expenditure.metadata?.nativeDomainId ?? Id.RootDomain,
          expenditureFundingPotId: expenditure.nativeFundingPotId,
          // @TODO: Refactor to support multiple token addresses
          amount: getExpenditurePayoutsTotal(expenditure),
          tokenAddress: expenditure.slots[0].payouts?.[0]?.tokenAddress,
        }}
      >
        Fund expenditure
      </ActionButton>
    );
  }

  if (
    expenditure.status === ExpenditureStatus.Locked &&
    isExpenditureFunded(expenditure)
  ) {
    return (
      <ActionButton
        actionType={ActionTypes.EXPENDITURE_FINALIZE}
        values={{
          colonyAddress: colony.colonyAddress,
          nativeExpenditureId: expenditure.nativeId,
        }}
      >
        Finalize expenditure
      </ActionButton>
    );
  }
  return null;
};

export default ExpenditureAdvanceButton;
