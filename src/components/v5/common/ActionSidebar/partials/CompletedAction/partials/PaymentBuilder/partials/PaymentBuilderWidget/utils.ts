import { ExpenditureStatus } from '~gql';
import { type Expenditure } from '~types/graphql.ts';
import { isExpenditureFullyFunded } from '~v5/common/ActionSidebar/utils.ts';

import { ExpenditureStep } from './types.ts';

export const getExpenditureStep = (
  expenditure: Expenditure | null | undefined,
) => {
  const { status } = expenditure || {};
  const isExpenditureFunded = isExpenditureFullyFunded(expenditure);

  switch (status) {
    case ExpenditureStatus.Draft:
      return ExpenditureStep.Review;
    case ExpenditureStatus.Locked: {
      if (isExpenditureFunded) {
        return ExpenditureStep.Release;
      }

      return ExpenditureStep.Funding;
    }
    case ExpenditureStatus.Finalized:
      return ExpenditureStep.Payment;
    case ExpenditureStatus.Cancelled:
      return ExpenditureStep.Cancel;
    default:
      return ExpenditureStep.Create;
  }
};

export const getCancelStepIndex = (
  expenditure: Expenditure | null | undefined,
) => {
  if (!expenditure) {
    return undefined;
  }

  const { lockingActions, finalizingActions } = expenditure;

  const isExpenditureLocked =
    lockingActions?.items && lockingActions.items.length > 0;
  const isExpenditureFinalized =
    finalizingActions?.items && finalizingActions.items.length > 0;
  const isExpenditureFullFunded = isExpenditureFullyFunded(expenditure);

  if (!isExpenditureLocked) {
    return 1;
  }

  if (isExpenditureLocked && !isExpenditureFullFunded) {
    return 2;
  }

  if (isExpenditureFullFunded && !isExpenditureFinalized) {
    return 3;
  }

  return undefined;
};
