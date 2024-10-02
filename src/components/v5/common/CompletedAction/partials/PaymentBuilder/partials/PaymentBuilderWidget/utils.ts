import { BigNumber } from 'ethers';

import { ExpenditureStatus } from '~gql';
import { type ExpenditureAction, type Expenditure } from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
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

const isActionBetween = (
  actionTime: Date,
  prevCancelTime: Date,
  nextCancelTime: Date,
): boolean => {
  return actionTime > prevCancelTime && actionTime < nextCancelTime;
};

export const segregateCancelActions = (
  expenditure: Expenditure | null | undefined,
) => {
  if (!expenditure) {
    return undefined;
  }

  const result: ExpenditureAction[][] = [];

  const { cancellingActions, fundingActions, finalizingActions } = expenditure;

  if (!cancellingActions?.items || cancellingActions.items.length === 0) {
    return result;
  }

  const seenActions = new Set();

  const sortedCancellingActions = [...cancellingActions.items].sort((a, b) => {
    if (a?.createdAt && b?.createdAt) {
      return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    }
    return 0;
  });

  const fundingActionTimes =
    fundingActions?.items.map((action) => new Date(action?.createdAt || '')) ||
    [];
  const finalizingActionTimes =
    finalizingActions?.items.map(
      (action) => new Date(action?.createdAt || ''),
    ) || [];

  sortedCancellingActions.forEach((action) => {
    if (!action) {
      return;
    }

    const { createdAt, id: transactionHash } = action;
    if (!createdAt || !transactionHash) return;

    const cancelActionTime = new Date(createdAt);
    const actionKey = `${createdAt}-${transactionHash}`;

    if (seenActions.has(actionKey)) {
      return;
    }

    if (result.length === 0) {
      result[0] = [action];
      seenActions.add(actionKey);
      return;
    }

    let actionPlaced = false;

    for (let i = 0; i < result.length; i += 1) {
      const currentCancelAction = result[i][0];
      const currentCancelActionTime = new Date(
        currentCancelAction?.createdAt || '',
      );

      const isLastCancelAction = i === result.length - 1;

      if (isLastCancelAction) {
        const prevCancelTime = currentCancelActionTime;

        const hasInterveningAction =
          fundingActionTimes.some((actionTime) =>
            isActionBetween(actionTime, prevCancelTime, cancelActionTime),
          ) ||
          finalizingActionTimes.some((actionTime) =>
            isActionBetween(actionTime, prevCancelTime, cancelActionTime),
          );

        if (hasInterveningAction) {
          result.push([action]);
        } else {
          result[result.length - 1].push(action);
        }

        seenActions.add(actionKey);
        break;
      }

      const nextCancelAction = result[i + 1][0];
      const nextCancelActionTime = new Date(nextCancelAction?.createdAt || '');

      const hasInterveningAction =
        fundingActionTimes.some((actionTime) =>
          isActionBetween(
            actionTime,
            currentCancelActionTime,
            nextCancelActionTime,
          ),
        ) ||
        finalizingActionTimes.some((actionTime) =>
          isActionBetween(
            actionTime,
            currentCancelActionTime,
            nextCancelActionTime,
          ),
        );

      if (
        cancelActionTime >= currentCancelActionTime &&
        cancelActionTime < nextCancelActionTime
      ) {
        if (!seenActions.has(actionKey)) {
          if (hasInterveningAction) {
            result.push([action]); // Start a new group
          } else {
            result[i + 1].push(action); // Add to the existing group
          }
          seenActions.add(actionKey);
          actionPlaced = true;
        }
        break;
      }
    }

    if (!actionPlaced && !seenActions.has(actionKey)) {
      result.push([action]);
      seenActions.add(actionKey);
    }
  });

  return result;
};

export const getExpenditureStep = (
  expenditure: Expenditure | null | undefined,
) => {
  const { status, userStake, cancellingActions, releaseActions, isStaked } =
    expenditure || {};
  const { isForfeited } = userStake || {};
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
      return `${ExpenditureStep.Cancel}-${2}`;
    }

    if (isExpenditureFunded) {
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
      if (!isForfeited && isStaked) {
        return ExpenditureStep.Reclaim;
      }

      if (releaseActions?.items && releaseActions?.items.length > 0) {
        return `${ExpenditureStep.Cancel}-${2}`;
      }

      if (isExpenditureFunded) {
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

  if (isExpenditureFullFunded && !isExpenditureFinalized) {
    return fundingItemIndex + 1;
  }

  return undefined;
};
