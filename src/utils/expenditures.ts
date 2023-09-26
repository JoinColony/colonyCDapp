import { BigNumber } from 'ethers';

import { Expenditure } from '~types';

// Returns true if there's enough balance in the expenditure's funding pot to cover all payouts of all tokens
export const isExpenditureFunded = (expenditure: Expenditure) => {
  return (
    expenditure.balances?.every((balance) =>
      BigNumber.from(balance.amount).gte(balance.requiredAmount),
    ) ?? false
  );
};
