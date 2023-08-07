import { ExpenditureSlotFieldValue } from './ExpenditureForm';

export const getInitialSlotFieldValue = (
  tokenAddress: string,
): ExpenditureSlotFieldValue => ({
  recipientAddress: '',
  tokenAddress,
  amount: '0',
});
