import { ExpenditurePayoutFieldValue } from '~common/Expenditures/ExpenditureForm';

/**
 * Util returning a map between token addresses and arrays of payouts field values
 */
export const groupExpenditurePayoutsByTokenAddresses = (
  payouts: ExpenditurePayoutFieldValue[],
) => {
  const payoutsByTokenAddresses = new Map<
    string,
    ExpenditurePayoutFieldValue[]
  >();
  payouts.forEach((payout) => {
    const currentTokenPayouts =
      payoutsByTokenAddresses.get(payout.tokenAddress) ?? [];
    payoutsByTokenAddresses.set(payout.tokenAddress, [
      ...currentTokenPayouts,
      payout,
    ]);
  });

  return payoutsByTokenAddresses;
};
