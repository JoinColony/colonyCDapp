import { weiToEth } from '@web3-onboard/common';
import { BigNumber } from 'ethers';

import { Expenditure } from '~types';

import {
  ExpenditurePayoutFieldValue,
  ExpenditureStageFieldValue,
  StagedPaymentFormValues,
} from './types';

export const getInitialPayoutFieldValue = (
  tokenAddress: string,
): ExpenditurePayoutFieldValue => ({
  slotId: 0,
  recipientAddress: '',
  tokenAddress,
  amount: '0',
  claimDelay: 0,
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
          claimDelay: slot.claimDelay ?? 0,
        })) ?? [];

    return [...payouts, ...slotPayouts];
  }, []);
};

export const getStagedExpenditurePayouts = (
  payload: StagedPaymentFormValues,
): ExpenditurePayoutFieldValue[] =>
  payload.stages.map((stage) => ({
    recipientAddress: payload.recipientAddress ?? '',
    tokenAddress: stage.tokenAddress,
    amount: stage.amount,
    claimDelay: 0,
  }));

export const getInitialStageFieldValue = (
  tokenAddress: string,
): ExpenditureStageFieldValue => ({
  name: '',
  amount: '0',
  tokenAddress,
});

export const getTimestampFromCleaveDateAndTime = (
  date: string,
  time: string,
) => {
  const resultDate = new Date();
  resultDate.setDate(Number(date.slice(0, 2)));
  resultDate.setMonth(Number(date.slice(2, 4)) - 1);
  resultDate.setFullYear(Number(date.slice(4, 8)));
  resultDate.setHours(Number(time.slice(0, 2)));
  resultDate.setMinutes(Number(time.slice(2, 4)));
  resultDate.setSeconds(0);

  const timestamp = Math.floor(resultDate.getTime() / 1000);
  return timestamp;
};
