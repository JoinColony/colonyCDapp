import { BigNumber } from 'ethers';

import { ExpenditureStatus } from '~gql';
import { type ExpenditureAction, type Expenditure } from '~types/graphql.ts';
import { notMaybe, notNull } from '~utils/arrays/index.ts';
import { MotionState } from '~utils/colonyMotions.ts';
import { type StepperItem } from '~v5/shared/Stepper/types.ts';

import { ExpenditureStep } from './types.ts';

/**
 * Returns a boolean indicating whether the expenditure is fully funded,
 * i.e. the balance of each token is greater than or equal to the sum of its payouts
 */
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

export const segregateCancelActions = (
  expenditure: Expenditure | null | undefined,
): {
  funding: ExpenditureAction[];
  locked: ExpenditureAction[];
  beforeLocked: ExpenditureAction[];
} => {
  if (!expenditure) {
    return {
      funding: [],
      locked: [],
      beforeLocked: [],
    };
  }

  const result: {
    funding: ExpenditureAction[];
    locked: ExpenditureAction[];
    beforeLocked: ExpenditureAction[];
  } = {
    funding: [],
    locked: [],
    beforeLocked: [],
  };

  const { cancellingActions, fundingActions, lockingActions } = expenditure;

  const sortedLockingActions =
    lockingActions?.items.filter(notNull).sort((a, b) => {
      if (a?.createdAt && b?.createdAt) {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      }
      return 0;
    }) ?? [];
  const sortedFundingActions =
    fundingActions?.items.filter(notNull).sort((a, b) => {
      if (a?.createdAt && b?.createdAt) {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      }
      return 0;
    }) ?? [];

  if (!cancellingActions?.items || cancellingActions.items.length === 0) {
    return result;
  }

  const seenActions = new Set();

  cancellingActions.items.forEach((action) => {
    if (!action) {
      return;
    }

    const { createdAt, transactionHash } = action;
    if (!createdAt || !transactionHash) return;

    const cancellingActionTime = new Date(createdAt);
    const actionKey = transactionHash;

    if (seenActions.has(actionKey)) {
      return;
    }

    if (!sortedLockingActions || sortedLockingActions.length === 0) {
      result.beforeLocked.push(action);
      seenActions.add(actionKey);
      return;
    }

    const latestLockingActionTime = new Date(
      sortedLockingActions[0]?.createdAt || '',
    );

    if (!sortedFundingActions || sortedFundingActions.length === 0) {
      result.locked.push(action);
      seenActions.add(actionKey);
      return;
    }

    const latestFundingActionTime = new Date(
      sortedFundingActions[0]?.createdAt || '',
    );

    if (
      cancellingActionTime > latestLockingActionTime &&
      cancellingActionTime < latestFundingActionTime &&
      !seenActions.has(actionKey)
    ) {
      result.locked.push(action);
      seenActions.add(actionKey);
    }

    if (
      cancellingActionTime > latestFundingActionTime &&
      !seenActions.has(actionKey)
    ) {
      result.funding.push(action);
      seenActions.add(actionKey);
    }
  });

  if (result.funding.length === 0) {
    result.locked.push(...result.funding);
    result.funding = [];
  }

  return result;
};

export const getExpenditureStep = (
  expenditure: Expenditure | null | undefined,
) => {
  const { status, cancellingActions, lockingActions, releaseActions } =
    expenditure || {};
  const isExpenditureFunded = isExpenditureFullyFunded(expenditure);

  const allCancelledMotions = cancellingActions?.items
    .map((cancellingAction) => cancellingAction?.motionData)
    .filter(notMaybe);
  const isAnyCancellingMotionInProgress = allCancelledMotions?.some(
    (motion) =>
      !motion.isFinalized && !motion.motionStateHistory.hasFailedNotFinalizable,
  );

  if (isAnyCancellingMotionInProgress) {
    if (releaseActions?.items && releaseActions?.items.length > 0) {
      return `${ExpenditureStep.Cancel}-${3}`;
    }

    if (isExpenditureFunded) {
      return `${ExpenditureStep.Cancel}-${2}`;
    }

    if (lockingActions?.items && lockingActions?.items.length > 0) {
      return `${ExpenditureStep.Cancel}-${1}`;
    }

    return `${ExpenditureStep.Cancel}-${0}`;
  }

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
    case ExpenditureStatus.Cancelled: {
      if (releaseActions?.items && releaseActions?.items.length > 0) {
        return `${ExpenditureStep.Cancel}-${3}`;
      }

      if (isExpenditureFunded) {
        return `${ExpenditureStep.Cancel}-${2}`;
      }

      if (lockingActions?.items && lockingActions?.items.length > 0) {
        return `${ExpenditureStep.Cancel}-${1}`;
      }

      return `${ExpenditureStep.Cancel}-${0}`;
    }
    default:
      return ExpenditureStep.Create;
  }
};

export const getCancelStepIndex = (
  expenditure: Expenditure | null | undefined,
  items: StepperItem<ExpenditureStep>[],
) => {
  if (!expenditure) {
    return undefined;
  }

  const { lockingActions, finalizingActions } = expenditure;

  const fundingItemIndex = items.findIndex(
    (item) => item.key === ExpenditureStep.Funding,
  );

  const isExpenditureLocked =
    lockingActions?.items && lockingActions.items.length > 0;
  const isExpenditureFinalized =
    finalizingActions?.items && finalizingActions.items.length > 0;
  const isExpenditureFullFunded = isExpenditureFullyFunded(expenditure);

  if (!isExpenditureLocked) {
    return 1;
  }

  if (isExpenditureLocked && !isExpenditureFullFunded) {
    return fundingItemIndex;
  }

  if (
    isExpenditureFullFunded &&
    expenditure.cancellingActions?.items?.[0]?.type === 'CANCEL_EXPENDITURE'
  ) {
    return fundingItemIndex + expenditure.cancellingActions.items.length + 1;
  }

  if (isExpenditureFullFunded && !isExpenditureFinalized) {
    return fundingItemIndex + 2;
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
