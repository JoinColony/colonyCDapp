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

  const amountsByToken = expenditure.slots.map((slot) => {
    const amounts = {};

    slot.payouts?.forEach((payout) => {
      if (!payout.isClaimed) {
        amounts[payout.tokenAddress] = BigNumber.from(
          amounts[payout.tokenAddress] ?? 0,
        ).add(payout.amount);
      }
    });

    return amounts;
  });

  return amountsByToken.every((token) => {
    const [tokenAddress] = Object.keys(token);
    const amount = token[tokenAddress];

    const tokenBalance = expenditure.balances?.find(
      (balance) => balance.tokenAddress === tokenAddress,
    );

    return amount.lte(tokenBalance?.amount ?? 0);
  });
};
