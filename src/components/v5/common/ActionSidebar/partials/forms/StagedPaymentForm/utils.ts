import { Id } from '@colony/colony-js';

import { type Colony } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import { type StagedPaymentFormValues } from './hooks.ts';

export const getStagedPaymentPayload = (
  colony: Colony,
  values: StagedPaymentFormValues,
  networkInverseFee: string,
) => {
  const colonyTokens = colony.tokens?.items.filter(notNull);
  const rootDomain = findDomainByNativeId(Id.RootDomain, colony);
  const createdInDomain =
    findDomainByNativeId(values.createdIn, colony) || rootDomain;

  if (!createdInDomain) {
    return null;
  }

  return {
    colonyAddress: colony.colonyAddress,
    createdInDomain,
    fundFromDomainId: 1,
    payouts: values.stages.map((stage) => ({
      recipientAddress: values.recipient,
      tokenAddress: stage.tokenAddress,
      amount: stage.amount,
      claimDelay: '0',
      tokenDecimals: getTokenDecimalsWithFallback(
        colonyTokens?.find(
          ({ token }) => token.tokenAddress === stage.tokenAddress,
        )?.token.decimals,
      ),
    })),
    isStaged: true,
    networkInverseFee,
    annotationMessage: values.description,
    stages: values.stages.map((stage) => ({
      name: stage.milestone,
      tokenAddress: stage.tokenAddress,
      amount: stage.amount,
    })),
  };
};
