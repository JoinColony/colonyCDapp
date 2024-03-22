import { BigNumber } from 'ethers';

import { type ExpenditurePayoutWithSlotId } from '~types/expenditures.ts';
import { type ExpenditureSlot } from '~types/graphql.ts';

/**
 * Returns expenditure payouts that are now claimable, i.e. their slot's claim delay has passed
 * If `currentTimestamp` is not provided, it assumes the expenditure has just been finalized
 * and will return all payouts in slots with a claim delay of 0
 */
export const getClaimableExpenditurePayouts = (
  slots: ExpenditureSlot[],
  currentTimestamp?: number | null,
  finalizedTimestamp?: number | null,
): ExpenditurePayoutWithSlotId[] => {
  return slots.reduce<ExpenditurePayoutWithSlotId[]>((payouts, slot) => {
    const claimDelay = BigNumber.from(slot.claimDelay ?? 0);
    const isDelayZero = claimDelay.eq(0);

    const hasDelayPassed = BigNumber.from(finalizedTimestamp ?? 0)
      .add(claimDelay)
      .lte(currentTimestamp ?? 0);

    if (
      (!currentTimestamp && !isDelayZero) ||
      (currentTimestamp && !hasDelayPassed)
    ) {
      return payouts;
    }

    const claimablePayouts =
      slot.payouts?.filter((payout) => !payout.isClaimed) ?? [];
    const payoutsWithSlotIds = claimablePayouts.map((payout) => ({
      ...payout,
      slotId: slot.id,
    }));

    return [...payouts, ...payoutsWithSlotIds];
  }, []);
};
