import { weiToEth } from '@web3-onboard/common';
import { BigNumber } from 'ethers';

import { Expenditure } from '~types';

import { ExpenditurePayoutFieldValue } from './types';

export const getInitialPayoutFieldValue = (
  tokenAddress: string,
): ExpenditurePayoutFieldValue => ({
  slotId: 0,
  recipientAddress: '',
  tokenAddress,
  amount: '0',
});

export const getExpenditurePayoutsFieldValue = (
  expenditure: Expenditure,
): ExpenditurePayoutFieldValue[] => {
  return expenditure.slots.reduce((payouts, slot) => {
    const slotPayouts: ExpenditurePayoutFieldValue[] =
      slot.payouts
        ?.filter((payout) => BigNumber.from(payout.amount).gt(0))
        .map((payout) => ({
          slotId: slot.id,
          recipientAddress: slot.recipientAddress ?? '',
          tokenAddress: payout.tokenAddress,
          amount: weiToEth(payout.amount),
        })) ?? [];

    return [...payouts, ...slotPayouts];
  }, []);
};
