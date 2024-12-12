import { type ExpenditurePayoutWithSlotId } from '~types/expenditures.ts';
import { waitForCondition } from '~utils/waitForCondition.ts';
import { type RefetchExpenditureType } from '~v5/common/CompletedAction/partials/PaymentBuilder/types.ts';

export const waitForDbAfterClaimingPayouts = async (
  payouts: ExpenditurePayoutWithSlotId[],
  refetchExpenditure: RefetchExpenditureType,
) => {
  const interval = 1000;
  const timeout = 30 * 1000; // 30 seconds

  await waitForCondition(
    async () => {
      const response = await refetchExpenditure();
      const expenditure = response.data.getExpenditure;
      if (!expenditure) {
        return false;
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

      return allPayoutsClaimed;
    },
    {
      interval,
      timeout,
    },
  );
};
