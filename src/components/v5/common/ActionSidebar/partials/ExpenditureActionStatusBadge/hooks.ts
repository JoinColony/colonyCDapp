import { useMemo } from 'react';

import { ExpenditureStatus } from '~gql';
import { type Expenditure } from '~types/graphql.ts';
import { isExpenditureFullyFunded } from '~v5/common/ActionSidebar/utils.ts';

import { ExpenditureActionStatus } from './types.ts';

export const useExpenditureActionStatus = (
  expenditure: Expenditure | null | undefined,
  withAdditionalStatuses?: boolean,
): ExpenditureActionStatus => {
  // @todo: update when edit mode will be implemented
  const paymentIsInEditMode = false;
  const paymentHasAnActiveEditRequest = false;

  // @todo: update when cancel with reputation decision method will be implemented
  const paymentHasAnActiveCancelRequest = false;

  const { status, slots } = expenditure || {};

  const allPaid = useMemo(
    () =>
      !slots
        ?.flatMap(({ payouts }) =>
          payouts?.map(({ isClaimed }) => ({ isClaimed })),
        )
        .find((payout) => !payout?.isClaimed),
    [slots],
  );

  const isExpenditureFunded = isExpenditureFullyFunded(expenditure);

  if (paymentIsInEditMode && withAdditionalStatuses) {
    return ExpenditureActionStatus.Edit;
  }

  if (paymentHasAnActiveEditRequest) {
    return ExpenditureActionStatus.Changes;
  }

  if (paymentHasAnActiveCancelRequest) {
    return ExpenditureActionStatus.Cancel;
  }

  switch (status) {
    case ExpenditureStatus.Draft:
      return ExpenditureActionStatus.Review;
    case ExpenditureStatus.Locked: {
      if (isExpenditureFunded) {
        return ExpenditureActionStatus.Release;
      }

      return ExpenditureActionStatus.Funding;
    }
    case ExpenditureStatus.Finalized: {
      if (allPaid) {
        return ExpenditureActionStatus.Passed;
      }

      return ExpenditureActionStatus.Payable;
    }
    case ExpenditureStatus.Cancelled:
      return ExpenditureActionStatus.Canceled;
    default:
      return ExpenditureActionStatus.Review;
  }
};
