import { BigNumber } from 'ethers';
import { Expenditure } from '~types';

export const getExpenditureBalancesByTokenAddress = (
  expenditure: Expenditure,
) => {
  const balancesByTokenAddresses = new Map<string, BigNumber>();
  expenditure.slots.forEach((slot) => {
    slot.payouts?.forEach((payout) => {
      if (payout.amount === '0') {
        return;
      }

      const currentBalance =
        balancesByTokenAddresses.get(payout.tokenAddress) ?? '0';

      balancesByTokenAddresses.set(
        payout.tokenAddress,
        BigNumber.from(payout.amount).add(currentBalance),
      );
    });
  });

  return balancesByTokenAddresses;
};
