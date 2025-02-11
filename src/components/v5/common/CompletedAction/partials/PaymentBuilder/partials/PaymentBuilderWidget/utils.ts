import { BigNumber } from 'ethers';

import { ExpenditureStatus } from '~gql';
import { type ExpenditureAction, type Expenditure } from '~types/graphql.ts';
import { MotionState } from '~utils/colonyMotions.ts';

import { ExpenditureStep } from './types.ts';

export const isExpenditureFullyFunded = (expenditure?: Expenditure | null) => {
  if (!expenditure) {
    return false;
  }

  if (!expenditure.balances) {
    return false;
  }

  const slotAmountsByToken = expenditure.slots.flatMap((slot) => {
    const amounts: { tokenAddress: string; amount: BigNumber }[] = [];

    slot.payouts?.forEach((payout) => {
      if (!payout.isClaimed) {
        const existingAmountIndex = amounts.findIndex(
          (item) => item.tokenAddress === payout.tokenAddress,
        );
        if (existingAmountIndex !== -1) {
          amounts[existingAmountIndex].amount = BigNumber.from(
            amounts[existingAmountIndex].amount ?? 0,
          ).add(payout.amount);
        } else {
          amounts.push({
            tokenAddress: payout.tokenAddress,
            amount: BigNumber.from(payout.amount),
          });
        }
      }
    });

    return amounts;
  });

  return slotAmountsByToken.every(({ tokenAddress, amount }) => {
    const tokenBalance = expenditure.balances?.find(
      (balance) => balance.tokenAddress === tokenAddress,
    );

    return amount.lte(tokenBalance?.amount ?? 0);
  });
};

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

export const sortActionsByCreatedDate = (
  a?: ExpenditureAction,
  b?: ExpenditureAction,
) => {
  if (a?.createdAt && b?.createdAt) {
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  }
  return 0;
};

export const getShouldShowMotionTimer = (motionState?: MotionState) => {
  return (
    motionState &&
    [
      MotionState.Staking,
      MotionState.Supported,
      MotionState.Voting,
      MotionState.Reveal,
    ].includes(motionState)
  );
};
