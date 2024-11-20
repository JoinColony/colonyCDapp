import { Id } from '@colony/colony-js';
import { unformatNumeral } from 'cleave-zen';
import { type TestContext } from 'yup';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { type CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure.ts';
import { type Colony } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { convertPeriodToSeconds } from '~utils/extensions.ts';
import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { getBalanceForTokenAndDomain } from '~utils/tokens.ts';

import { type PaymentBuilderFormValues } from './hooks.ts';

export const getPaymentBuilderPayload = (
  colony: Colony,
  values: PaymentBuilderFormValues,
  networkInverseFee: string,
): CreateExpenditurePayload | null => {
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
    fundFromDomainId: values.from,
    isStaged: false,
    networkInverseFee,
    annotationMessage: values.description,
    payouts: values.payments.map((payment) => ({
      recipientAddress: payment.recipient,
      tokenAddress: payment.tokenAddress,
      amount: payment.amount.toString(),
      claimDelay: convertPeriodToSeconds(
        Number(unformatNumeral(payment.delay)),
      ),
      tokenDecimals:
        colonyTokens?.find(
          ({ token }) => token.tokenAddress === payment.tokenAddress,
        )?.token.decimals || DEFAULT_TOKEN_DECIMALS,
    })),
  };
};

interface AllTokensAmountValidationParams {
  value: string | null | undefined;
  context: TestContext<{ formValues?: any }>;
  colony: Colony;
}

export const allTokensAmountValidation = ({
  value,
  context,
  colony,
}: AllTokensAmountValidationParams) => {
  if (!value) {
    return false;
  }

  const {
    options: { context: formContext },
    parent,
    path,
  } = context;
  const { formValues } = formContext || {};
  const { from, _tokenSums } = formValues || {};
  const { tokenAddress: fieldTokenAddress } = parent || {};

  if (!fieldTokenAddress) {
    return false;
  }

  const index = getLastIndexFromPath(path);

  if (index === undefined) {
    return context.createError({
      message: formatText({
        id: 'errors.token.empty',
      }),
      path,
    });
  }

  const token = colony.tokens?.items
    .filter(notNull)
    .find(
      ({ token: { tokenAddress } }) => tokenAddress === fieldTokenAddress,
    )?.token;

  if (!token) {
    return context.createError({
      message: formatText(
        {
          id: 'errors.token.notValid',
        },
        {
          paymentIndex: index + 1,
        },
      ),
      path,
    });
  }

  const tokenAmountSum = _tokenSums[fieldTokenAddress];

  const tokenBalance = getBalanceForTokenAndDomain(
    colony.balances,
    fieldTokenAddress,
    from || Id.RootDomain,
  );

  if (!tokenAmountSum?.lte(tokenBalance)) {
    return context.createError({
      message: formatText(
        {
          id: 'errors.amount.sum',
        },
        {
          tokenSymbol: token?.symbol || '',
        },
      ),
      path,
    });
  }

  return true;
};

export const delayGreaterThanZeroValidation = (
  value: number | null | undefined,
  context: TestContext,
) => {
  if (value === undefined || !value) {
    return true;
  }

  const { path } = context;

  const index = getLastIndexFromPath(path);

  if (index === undefined) {
    return context.createError({
      message: formatText({
        id: 'errors.amount.smallerThanZero',
      }),
      path,
    });
  }

  if (value.toString().includes('.')) {
    return context.createError({
      message: formatText(
        {
          id: 'errors.amount.smallerThanZeroInMultiplePayments',
        },
        {
          paymentIndex: index + 1,
        },
      ),
      path,
    });
  }

  return true;
};
