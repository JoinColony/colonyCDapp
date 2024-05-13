import { Id } from '@colony/colony-js';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { type CreateStakedExpenditurePayload } from '~redux/sagas/expenditures/createStakedExpenditure.ts';
import { type Colony } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { convertPeriodToSeconds } from '~utils/extensions.ts';

import { type PaymentBuilderFormValues } from '../forms/PaymentBuilderForm/hooks.ts';

export const getCreateStakedExpenditurePayload = (
  colony: Colony,
  values: PaymentBuilderFormValues,
  networkInverseFee: string,
  stakeAmount: string,
  stakedExpenditureAddress: string,
): CreateStakedExpenditurePayload | null => {
  const colonyTokens = colony.tokens?.items.filter(notNull);
  const rootDomain = findDomainByNativeId(Id.RootDomain, colony);
  const createdInDomain =
    findDomainByNativeId(values.createdIn, colony) || rootDomain;

  if (!createdInDomain || !stakeAmount || !stakedExpenditureAddress) {
    return null;
  }

  return {
    colonyAddress: colony.colonyAddress,
    createdInDomain,
    fundFromDomainId: values?.from,
    isStaged: false,
    networkInverseFee,
    annotationMessage: values?.description,
    payouts:
      values?.payments?.map((payment) => ({
        recipientAddress: payment.recipient || '',
        tokenAddress: payment.tokenAddress || '',
        amount: payment.amount || '0',
        claimDelay: convertPeriodToSeconds(payment.delay || 0),
        tokenDecimals:
          colonyTokens?.find(
            ({ token }) => token.tokenAddress === payment.tokenAddress,
          )?.token.decimals || DEFAULT_TOKEN_DECIMALS,
      })) || [],
    stakeAmount,
    stakedExpenditureAddress,
  };
};
