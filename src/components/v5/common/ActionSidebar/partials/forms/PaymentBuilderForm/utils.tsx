import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { type TestContext } from 'yup';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { type CreateExpenditurePayload } from '~redux/sagas/expenditures/createExpenditure.ts';
import { type Colony } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { convertPeriodToSeconds } from '~utils/extensions.ts';
import getLastIndexFromPath from '~utils/getLastIndexFromPath.ts';
import { formatText } from '~utils/intl.ts';
import { groupBy } from '~utils/lodash.ts';
import {
  calculateFee,
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

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
      claimDelay: convertPeriodToSeconds(payment.delay),
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
  networkInverseFee: string | undefined;
}

export const allTokensAmountValidation = ({
  value,
  context,
  colony,
  networkInverseFee,
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
  const { payments, from } = formValues || {};
  const { tokenAddress: fieldTokenAddress } = parent || {};

  if (!fieldTokenAddress) {
    return false;
  }

  const groupedTokens = groupBy(payments, (payment) => payment.tokenAddress);

  const token = colony.tokens?.items
    .filter(notNull)
    .find(
      ({ token: { tokenAddress } }) => tokenAddress === fieldTokenAddress,
    )?.token;

  const tokenAmountSum = groupedTokens[fieldTokenAddress].reduce(
    (acc, payment) => {
      const { amount } = payment;

      if (!amount) {
        return acc;
      }

      const tokenDecimals = getTokenDecimalsWithFallback(token?.decimals);

      const { totalToPay } = calculateFee(
        amount,
        networkInverseFee ?? '0',
        tokenDecimals,
      );

      return acc.add(totalToPay);
    },
    BigNumber.from('0'),
  );

  const tokenBalance = getBalanceForTokenAndDomain(
    colony.balances,
    fieldTokenAddress,
    from || Id.RootDomain,
  );

  const index = getLastIndexFromPath(path);

  if (index === undefined) {
    return context.createError({
      message: formatText({
        id: 'errors.token.empty',
      }),
      path,
    });
  }

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

  if (!tokenAmountSum.lte(tokenBalance)) {
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
