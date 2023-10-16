import { BigNumber, BigNumberish } from 'ethers';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

import { Expenditure } from '~types';

// Returns true if there's enough balance in the expenditure's funding pot to cover all payouts of all tokens
export const isExpenditureFunded = (expenditure: Expenditure) => {
  return (
    expenditure.balances?.every((balance) =>
      BigNumber.from(balance.amount).gte(balance.requiredAmount),
    ) ?? false
  );
};

/**
 * Emphasising this is a temporary solution to convert ETH amount to WEI
 * using the default token decimals. The new UI should use the selected token decimals
 */
export const TEMP_convertEthToWei = (amount: BigNumberish) =>
  BigNumber.from(amount).mul(BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS));
