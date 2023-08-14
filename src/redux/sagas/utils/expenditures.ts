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
  payouts.forEach((payout, index) => {
    const currentTokenPayouts =
      payoutsByTokenAddresses.get(payout.tokenAddress) ?? [];
    // Add slot id to each payout
    const payoutWithId = { ...payout, slotId: index + 1 };
    payoutsByTokenAddresses.set(payout.tokenAddress, [
      ...currentTokenPayouts,
      payoutWithId,
    ]);
  });

  return payoutsByTokenAddresses;
};
