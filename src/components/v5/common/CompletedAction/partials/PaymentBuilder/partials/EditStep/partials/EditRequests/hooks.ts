import { type ExpenditureSlot } from '~types/graphql.ts';

const useCountChanges = (
  newSlots: ExpenditureSlot[],
  oldSlots: ExpenditureSlot[],
) => {
  let changes = 0;

  if (newSlots.length !== oldSlots.length) {
    changes += newSlots.length - oldSlots.length;
  }

  newSlots.forEach((newSlot, index) => {
    const oldSlot = oldSlots[index];

    if (!oldSlot) return;

    if (newSlot.recipientAddress !== oldSlot.recipientAddress) {
      changes += 1;
    }

    if (newSlot.claimDelay !== oldSlot.claimDelay) {
      changes += 1;
    }

    newSlot?.payouts?.forEach((newPayout, payoutIndex) => {
      const oldPayout = oldSlot?.payouts?.[payoutIndex];

      if (newPayout.tokenAddress !== oldPayout?.tokenAddress) {
        changes += 1;
      }

      if (newPayout.amount !== oldPayout?.amount) {
        changes += 1;
      }
    });
  });

  return changes;
};

export default useCountChanges;