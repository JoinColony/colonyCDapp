import React from 'react';
import { Id } from '@colony/colony-js';

import { ExpenditureStatus } from '~gql';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { Colony, Expenditure } from '~types';
import { isExpenditureFunded } from '~utils/expenditures';
import { findDomainByNativeId } from '~utils/domains';

interface ExpenditureAdvanceButtonProps {
  expenditure: Expenditure;
  colony: Colony;
}

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
            findDomainByNativeId(
              expenditure.metadata?.fundFromDomainNativeId ?? Id.RootDomain,
              colony,
            )?.nativeFundingPotId ?? Id.RootPot,
          expenditure,
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
