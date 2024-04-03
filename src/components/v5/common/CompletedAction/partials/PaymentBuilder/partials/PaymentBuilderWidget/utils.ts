import { BigNumber } from 'ethers';

import { ExpenditureStatus } from '~gql';
import { type Expenditure } from '~types/graphql.ts';

import { ExpenditureStep } from './types.ts';

// @todo: update steps
export const getExpenditureStep = (status?: ExpenditureStatus) => {
  switch (status) {
    case ExpenditureStatus.Draft:
      return ExpenditureStep.Review;
    case ExpenditureStatus.Locked:
      return ExpenditureStep.Funding;
    case ExpenditureStatus.Finalized:
      return ExpenditureStep.Payment;
    default:
      return ExpenditureStep.Create;
  }
};

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
          amounts[existingAmountIndex].amount = amounts[
            existingAmountIndex
          ].amount.add(payout.amount);
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
