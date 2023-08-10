import { ExpenditureSlotFieldValue } from '~common/Expenditures/ExpenditureForm';

type SlotFieldValueWithId = ExpenditureSlotFieldValue & { id: number };

/**
 * Util returning a map between token addresses and arrays of slot field values
 */
export const groupExpenditureSlotsByTokenAddresses = (
  slots: ExpenditureSlotFieldValue[],
) => {
  const slotsByTokenAddress = new Map<string, SlotFieldValueWithId[]>();
  slots.forEach((slot, index) => {
    const currentSlots = slotsByTokenAddress.get(slot.tokenAddress) ?? [];
    // Add id to each slot
    const slotWithId = { ...slot, id: index + 1 };
    slotsByTokenAddress.set(slot.tokenAddress, [...currentSlots, slotWithId]);
  });

  return slotsByTokenAddress;
};
