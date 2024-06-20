import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { type CreateStakedExpenditurePayload } from '~redux/sagas/expenditures/createStakedExpenditure.ts';
import { type Colony } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { convertPeriodToSeconds } from '~utils/extensions.ts';

import { type PaymentBuilderFormValues } from '../forms/PaymentBuilderForm/hooks.ts';
import { unformatNumeral } from 'cleave-zen';

export const getCreateStakedExpenditurePayload = (
  colony: Colony,
  values: PaymentBuilderFormValues,
  options: {
    networkInverseFee: string;
    stakeAmount: string;
    stakedExpenditureAddress: string;
    activeBalance: string | undefined;
  },
): CreateStakedExpenditurePayload | null => {
  const {
    activeBalance,
    networkInverseFee,
    stakeAmount,
    stakedExpenditureAddress,
  } = options;
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
        claimDelay: convertPeriodToSeconds(
          Number(unformatNumeral(payment.delay)),
        ),
        tokenDecimals:
          colonyTokens?.find(
            ({ token }) => token.tokenAddress === payment.tokenAddress,
          )?.token.decimals || DEFAULT_TOKEN_DECIMALS,
      })) || [],
    stakeAmount: BigNumber.from(stakeAmount),
    stakedExpenditureAddress,
    tokenAddress: colony.nativeToken.tokenAddress,
    activeBalance,
  };
};
