import { weiToEth } from '@web3-onboard/common';
import { BigNumber } from 'ethers';
import { NavigateFunction } from 'react-router-dom';

import { Colony, Expenditure } from '~types';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { findDomainByNativeId } from '~utils/domains';
import { CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure';

import {
  ExpenditureFormType,
  ExpenditurePayoutFieldValue,
  ExpenditureStageFieldValue,
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

const getStagedExpenditurePayouts = (
  payload: any, // @TODO: Fix
): ExpenditurePayoutFieldValue[] =>
  payload.stages.map((stage) => ({
    recipientAddress: payload.recipientAddress ?? '',
    tokenAddress: stage.tokenAddress,
    amount: stage.amount,
    claimDelay: 0,
  }));

export const getCreateExpenditureTransformPayloadFn = (
  colony: Colony,
  navigate: NavigateFunction,
) =>
  pipe(
    mapPayload((payload: any) => {
      // @TODO: Fix
      const isStaged = payload.formType === ExpenditureFormType.Staged;

      return {
        ...payload,
        colony,
        createdInDomain: colony
          ? findDomainByNativeId(payload.createInDomainId, colony)
          : null,
        fundFromDomainId: payload.fundFromDomainId,
        isStaged,
        payouts: isStaged
          ? getStagedExpenditurePayouts(payload)
          : payload.payouts,
      } as CreateExpenditurePayload;
    }),
    withMeta({ navigate }),
  );

export const getInitialStageFieldValue = (
  tokenAddress: string,
): ExpenditureStageFieldValue => ({
  name: '',
  amount: '0',
  tokenAddress,
});
