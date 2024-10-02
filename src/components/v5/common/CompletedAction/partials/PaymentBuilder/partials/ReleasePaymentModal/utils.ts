import { type ExpenditurePayoutWithSlotId } from '~types/expenditures.ts';
import { type RefetchExpenditureType } from '~v5/common/CompletedAction/partials/PaymentBuilder/types.ts';

export const waitForDbAfterClaimingPayouts = (
  payouts: ExpenditurePayoutWithSlotId[],
  refetchExpenditure: RefetchExpenditureType,
) => {
  const interval = 1000;
  const timeout = 30 * 1000; // 30 seconds

  return new Promise<void>((resolve, reject) => {
    const initTime = new Date().valueOf();
    const intervalId = setInterval(async () => {
      if (new Date().valueOf() - initTime > timeout) {
        // after timeout, assume something went wrong
        clearInterval(intervalId);
        reject(
          new Error(
            `After 30 seconds, could not verify all payouts as claimed in the database.`,
          ),
        );
      }

      const response = await refetchExpenditure();
      const expenditure = response.data.getExpenditure;
      if (!expenditure) {
        return;
      }

      // Check if all payouts are claimed
      const allPayoutsClaimed = payouts.every((payout) => {
        const targetSlot = expenditure.slots.find(
          (slot) => slot.id === payout.slotId,
        );
        if (!targetSlot) {
          return false;
        }

        const targetPayout = targetSlot.payouts?.find(
          (p) => p.tokenAddress === payout.tokenAddress,
        );
        return targetPayout?.isClaimed === true;
      });

      if (allPayoutsClaimed) {
        clearInterval(intervalId);
        resolve();
      }
    }, interval);
  });
};
