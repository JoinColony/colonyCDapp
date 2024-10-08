import { BigNumber } from 'ethers';

import { type ExpenditureActionFragment, ExpenditureStatus } from '~gql';
import { type ExpenditureAction, type Expenditure } from '~types/graphql.ts';

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

export const getFundingItemIndex = (
  fundingActions: ExpenditureActionFragment[][] | undefined,
) => {
  if (!fundingActions || fundingActions.length === 0) {
    return 0;
  }

  const lastFundingItem = fundingActions[fundingActions.length - 1];
  const lastItem = lastFundingItem[lastFundingItem.length - 1];

  if (
    !lastItem.motionData ||
    lastItem.motionData.motionStateHistory.hasPassed
  ) {
    return fundingActions.length;
  }

  return fundingActions.length - 1;
};

export const segregateFundingActions = (
  expenditure: Expenditure | null | undefined,
) => {
  if (!expenditure) {
    return undefined;
  }

  const result: ExpenditureAction[][] = [];

  const { fundingActions } = expenditure;

  if (!fundingActions?.items || fundingActions.items.length === 0) {
    return result;
  }

  const seenActions = new Set();

  const sortedFundingActions = [...fundingActions.items].sort((a, b) => {
    if (a?.createdAt && b?.createdAt) {
      return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    }
    return 0;
  });

  sortedFundingActions.forEach((action, index) => {
    if (!action) {
      return;
    }

    const prevAction = sortedFundingActions[index - 1];

    if (prevAction && prevAction.motionData) {
      const { hasFailed, hasFailedNotFinalizable, hasPassed } =
        prevAction.motionData.motionStateHistory;

      if ((hasFailed || hasFailedNotFinalizable) && !hasPassed) {
        result[result.length - 1].push(action);
        return;
      }
    }

    const { createdAt, transactionHash } = action;
    if (!createdAt || !transactionHash) return;

    const fundingActionTime = new Date(createdAt);
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
      const currentFundingAction = result[i][0];
      const currentFundingActionTime = new Date(
        currentFundingAction?.createdAt || '',
      );

      const isLastFundingAction = i === result.length - 1;

      if (isLastFundingAction) {
        if (
          fundingActionTime < currentFundingActionTime &&
          !seenActions.has(actionKey)
        ) {
          result[0].push(action);
          seenActions.add(actionKey);
        } else if (
          fundingActionTime >= currentFundingActionTime &&
          !seenActions.has(actionKey)
        ) {
          result[i + 1] = [action];
          seenActions.add(actionKey);
          actionPlaced = true;
        }
        break;
      }

      const nextFundingAction = result[i + 1][0];
      const nextFundingActionTime = new Date(
        nextFundingAction?.createdAt || '',
      );

      if (
        fundingActionTime >= currentFundingActionTime &&
        fundingActionTime < nextFundingActionTime
      ) {
        if (!seenActions.has(actionKey)) {
          result[i + 1].push(action);
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
  const { status } = expenditure || {};
  const isExpenditureFunded = isExpenditureFullyFunded(expenditure);

  switch (status) {
    case ExpenditureStatus.Draft:
      return ExpenditureStep.Review;
    case ExpenditureStatus.Locked: {
      if (isExpenditureFunded) {
        return ExpenditureStep.Release;
      }

      const groupedFundingActions = segregateFundingActions(expenditure);
      const itemIndex = getFundingItemIndex(groupedFundingActions);

      return `${ExpenditureStep.Funding}-${itemIndex}`;
    }
    case ExpenditureStatus.Finalized:
      return ExpenditureStep.Payment;
    case ExpenditureStatus.Cancelled:
      return ExpenditureStep.Cancel;
    default:
      return ExpenditureStep.Create;
  }
};

export const getCurrentStepIndex = (
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

export const segregateEditActions = (
  expenditure: Expenditure | null | undefined,
) => {
  if (!expenditure) {
    return undefined;
  }

  const result: {
    funding: ExpenditureAction[][];
    finalizing: ExpenditureAction[];
  } = {
    funding: [],
    finalizing: [],
  };

  const { editingActions } = expenditure;

  if (!editingActions?.items || editingActions.items.length === 0) {
    return result;
  }

  const groupedFundingActions = segregateFundingActions(expenditure);

  const seenActions = new Set();

  editingActions.items.forEach((action) => {
    if (!action) {
      return;
    }

    const { createdAt, transactionHash } = action;
    if (!createdAt || !transactionHash) return;

    const editingActionTime = new Date(createdAt);
    const actionKey = `${createdAt}-${transactionHash}`;

    if (seenActions.has(actionKey)) {
      return;
    }

    if (!groupedFundingActions || groupedFundingActions.length === 0) {
      result.funding[0] = result.funding[0] || [];
      result.funding[0].push(action);
      seenActions.add(actionKey);
      return;
    }

    let actionPlaced = false;

    for (let i = 0; i < groupedFundingActions.length; i += 1) {
      const currentFundingGroup = groupedFundingActions[i];
      const currentFundingActionTime = new Date(
        currentFundingGroup[0]?.createdAt || '',
      );

      const isLastFundingGroup = i === groupedFundingActions.length - 1;

      if (isLastFundingGroup) {
        if (
          editingActionTime < currentFundingActionTime &&
          !seenActions.has(actionKey)
        ) {
          if (!result.funding[0]) {
            result.funding[0] = [];
          }
          result.funding[0].push(action);
          seenActions.add(actionKey);
        } else if (
          editingActionTime >= currentFundingActionTime &&
          !seenActions.has(actionKey)
        ) {
          result.funding[i + 1] = result.funding[i + 1] || [];
          result.funding[i + 1].push(action);
          seenActions.add(actionKey);
          actionPlaced = true;
        }
        break;
      }

      const nextFundingGroup = groupedFundingActions[i + 1];
      const nextFundingActionTime = new Date(
        nextFundingGroup[0]?.createdAt || '',
      );

      if (
        editingActionTime >= currentFundingActionTime &&
        editingActionTime < nextFundingActionTime
      ) {
        if (!seenActions.has(actionKey)) {
          result.funding[i + 1] = result.funding[i + 1] || [];
          result.funding[i + 1].push(action);
          seenActions.add(actionKey);
          actionPlaced = true;
        }
        break;
      }
    }

    if (!actionPlaced && !seenActions.has(actionKey)) {
      result.finalizing.push(action);
      seenActions.add(actionKey);
    }
  });

  return result;
};
