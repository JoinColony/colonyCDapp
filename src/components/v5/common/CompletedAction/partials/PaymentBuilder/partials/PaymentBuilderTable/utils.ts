import { type ExpenditureSlot } from '~types/graphql.ts';

export const getChangedSlots = (
  newSlots: ExpenditureSlot[] | undefined,
  oldSlots: ExpenditureSlot[] | undefined,
) => {
  if (!newSlots || !oldSlots) return [];

  const changedSlots = newSlots.filter((newSlot) => {
    const oldSlot = oldSlots.find((slot) => slot.id === newSlot.id);

    if (!oldSlot) return true;

    const hasChanges =
      newSlot.recipientAddress !== oldSlot.recipientAddress ||
      newSlot.claimDelay !== oldSlot.claimDelay ||
      newSlot.payoutModifier !== oldSlot.payoutModifier ||
      newSlot?.payouts?.length !== oldSlot.payouts?.length ||
      newSlot?.payouts?.some((newPayout, index) => {
        const oldPayout = oldSlot?.payouts?.[index];
        return (
          newPayout.tokenAddress !== oldPayout?.tokenAddress ||
          newPayout.amount !== oldPayout.amount ||
          newPayout.isClaimed !== oldPayout.isClaimed ||
          newPayout.networkFee !== oldPayout.networkFee
        );
      });

    return hasChanges;
  });

  return changedSlots;
};
