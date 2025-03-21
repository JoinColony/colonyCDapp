import { Id } from '@colony/colony-js';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { SplitPaymentDistributionType } from '~gql';
import { type CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure.ts';
import { type CreateStakedExpenditurePayload } from '~redux/sagas/expenditures/createStakedExpenditure.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';

import { type SplitPaymentFormValues } from './hooks.ts';
import { type SplitPaymentRecipientsFieldModel } from './partials/SplitPaymentRecipientsField/types.ts';

export const getSplitPaymentPayload = (
  colony: Colony,
  values: SplitPaymentFormValues,
  networkInverseFee: string,
): CreateExpenditurePayload | CreateStakedExpenditurePayload | null => {
  const colonyTokens = colony.tokens?.items.filter(notNull);
  const {
    tokenAddress,
    distributionMethod,
    team,
    description,
    payments,
    decisionMethod,
  } = values;
  const rootDomain = findDomainByNativeId(Id.RootDomain, colony);
  const createdInDomain =
    decisionMethod === DecisionMethod.Permissions
      ? undefined
      : findDomainByNativeId(team, colony) || rootDomain;

  if (!payments.length) {
    return null;
  }

  const tokenDecimals =
    colonyTokens?.find(({ token }) => token.tokenAddress === tokenAddress)
      ?.token.decimals || DEFAULT_TOKEN_DECIMALS;

  return {
    colonyAddress: colony.colonyAddress,
    createdInDomain,
    fundFromDomainId: team,
    isStaged: false,
    networkInverseFee,
    annotationMessage: description,
    distributionType: getEnumValueFromKey(
      SplitPaymentDistributionType,
      distributionMethod,
    ),
    payouts:
      payments.map((payment) => ({
        recipientAddress: payment.recipient,
        tokenAddress,
        amount: payment.amount,
        claimDelay: '0',
        tokenDecimals,
      })) || [],
  };
};

export const getUnevenSplitPaymentTotalPercentage = (
  amount: number,
  recipients: SplitPaymentRecipientsFieldModel[],
) => {
  if (!amount) {
    return 0;
  }

  const total =
    recipients?.reduce((acc, recipient) => {
      return acc + Number(recipient.amount);
    }, 0) || 0;

  const percentage = (100 * total) / amount;

  return Number(percentage.toFixed(4));
};
