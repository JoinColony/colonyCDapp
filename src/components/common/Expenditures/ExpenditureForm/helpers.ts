import { weiToEth } from '@web3-onboard/common';
import { BigNumber } from 'ethers';
import { NavigateFunction } from 'react-router-dom';
import { Id } from '@colony/colony-js';

import { Colony, Expenditure } from '~types';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { findDomainByNativeId } from '~utils/domains';
import { CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure';

import { ExpenditureFormValues, ExpenditurePayoutFieldValue } from './types';

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

export const getCreateExpenditureTransformPayloadFn = (
  colony: Colony,
  navigate: NavigateFunction,
) =>
  pipe(
    mapPayload(
      (
        payload: ExpenditureFormValues & {
          stakeAmount?: string;
          stakedExpenditureAddress?: string;
        },
      ) =>
        ({
          ...payload,
          colony,
          // @TODO: These should come from the form values
          createdInDomain: colony
            ? findDomainByNativeId(Id.RootDomain, colony)
            : null,
          fundFromDomainId: Id.RootDomain,
        } as CreateExpenditurePayload),
    ),
    withMeta({ navigate }),
  );
