import { Id } from '@colony/colony-js';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { type Colony } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { findDomainByNativeId } from '~utils/domains.ts';

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
    payouts: [],
    isStaged: true,
    networkInverseFee,
    annotationMessage: values.description,
    stages: values.stages.map((stage) => ({
      name: stage.milestone,
      tokenAddress: stage.tokenAddress,
      amount: stage.amount,
      tokenDecimals:
        colonyTokens?.find(
          ({ token }) => token.tokenAddress === stage.tokenAddress,
        )?.token.decimals || DEFAULT_TOKEN_DECIMALS,
    })),
  };
};
