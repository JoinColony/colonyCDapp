import { weiToEth } from '@web3-onboard/common';

import { ExpenditureSlot } from '~types';

import { ExpenditurePayoutFieldValue } from './types';

export const getInitialPayoutFieldValue = (
  tokenAddress: string,
): ExpenditurePayoutFieldValue => ({
  slotId: 0,
  recipientAddress: '',
  tokenAddress,
  amount: '0',
});

export const mapExpenditureSlotToPayoutFieldValues = (
  expenditureSlot: ExpenditureSlot,
): ExpenditurePayoutFieldValue[] => {
  return (
    expenditureSlot.payouts?.map((payout) => ({
      slotId: expenditureSlot.id,
      recipientAddress: expenditureSlot.recipientAddress ?? '',
      tokenAddress: payout.tokenAddress,
      amount: weiToEth(payout.amount),
    })) ?? []
  );
};
