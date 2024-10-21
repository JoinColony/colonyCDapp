import { type ExpenditureSlot } from '~types/graphql.ts';

const useCountChanges = (
  newSlots: ExpenditureSlot[],
  oldSlots: ExpenditureSlot[],
) => {
  let changes = 0;

  if (newSlots.length !== oldSlots.length) {
    changes += Math.abs(newSlots.length - oldSlots.length);
  }

  const sortedOldSlots = oldSlots
    ? [...oldSlots].sort((a, b) => a.id - b.id)
    : [];
  const sortedNewSlots = newSlots
    ? [...newSlots].sort((a, b) => a.id - b.id)
    : [];

  sortedNewSlots.forEach((newSlot, index) => {
    const oldSlot = sortedOldSlots[index];

    if (!oldSlot) return;

    if (newSlot.recipientAddress !== oldSlot.recipientAddress) {
      changes += 1;
    }

    if (newSlot.claimDelay !== oldSlot.claimDelay) {
      changes += 1;
    }

    const oldPayout = oldSlot?.payouts?.[0];
    const newPayout = newSlot?.payouts?.[0];

    if (oldPayout && newPayout) {
      if (newPayout.tokenAddress !== oldPayout.tokenAddress) {
        changes += 1;
      }

      if (newPayout.amount !== oldPayout.amount) {
        changes += 1;
      }
    }
  });

  return changes;
};

export default useCountChanges;
