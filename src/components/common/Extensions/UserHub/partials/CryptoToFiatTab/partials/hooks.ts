import { useWatch } from 'react-hook-form';
import { defineMessages } from 'react-intl';
import { type ObjectSchema, object, number } from 'yup';

import { useCryptoToFiatContext } from '~frame/v5/pages/UserCryptoToFiatPage/context/CryptoToFiatContext.ts';
import {
  ExtendedSupportedCurrencies,
  SupportedCurrencies,
  useGetGatewayFeeQuery,
} from '~gql';
import { useCurrencyConversionRate } from '~hooks/useCurrencyConversionRate.ts';
import { pipe, mapPayload } from '~utils/actions.ts';
import { type CoinGeckoSupportedCurrencies } from '~utils/currency/types.ts';
import { formatText } from '~utils/intl.ts';

import {
  getConvertedAmount,
  getFeeAmountBasedOn,
  getFormattedStringNumeral,
  getUnformattedStringNumeral,
} from './helpers.ts';
import { FeeType, type TransferFormValues } from './types.ts';

const MSG = defineMessages({
  amountRequired: {
    id: 'common.Extensions.UserHub.partials.TransferForm.amountRequired',
    defaultMessage: 'A withdraw amount is required',
  },
  amountGreaterThanBalance: {
    id: 'common.Extensions.UserHub.partials.TransferForm.amountGreaterThanBalance',
    defaultMessage: 'Not enough funds available',
  },
  amountLessThanOne: {
    id: 'common.Extensions.UserHub.partials.TransferForm.amountLessThanOne',
    defaultMessage: 'Minimum withdraw amount is 1 USDC',
  },
});

export enum TransferFields {
  AMOUNT = 'amount',
  BALANCE = 'balance',
  CONVERTED_AMOUNT = 'convertedAmount',
}

const getNullableFloat = (value: string | null | undefined) =>
  !value || value === '.'
    ? null
    : parseFloat(value.toString().replace(/,/g, ''));

export const useTransferForm = () => {
  const validationSchema: ObjectSchema<TransferFormValues> = object()
    .shape({
      [TransferFields.BALANCE]: number(),
      [TransferFields.AMOUNT]: number()
        .nullable()
        .transform((_, original) => getNullableFloat(original))
        .min(1, formatText(MSG.amountLessThanOne))
        .test(
          'amount-over-max',
          formatText(MSG.amountGreaterThanBalance),
          (value, context) => {
            if (!value) {
              return true;
            }
            return value <= context.parent.balance;
          },
        )
        .required(formatText(MSG.amountRequired)),
      [TransferFields.CONVERTED_AMOUNT]: number()
        .nullable()
        .transform((_, original) => getNullableFloat(original))
        .required(''),
    })
    .defined();

  const transform = pipe(
    mapPayload(({ amount }) => {
      return {
        amount: getNullableFloat(amount),
      };
    }),
  );

  return {
    transform,
    validationSchema,
  };
};

export const useBankAccountCurrency = () => {
  const { bankAccountData } = useCryptoToFiatContext();

  return (
    (bankAccountData?.currency.toUpperCase() as CoinGeckoSupportedCurrencies) ??
    SupportedCurrencies.Usd
  );
};

export const useTransferFees = () => {
  const selectedCurrency = useBankAccountCurrency();
  const selectedCurrencyConversionRate = useCurrencyConversionRate({
    tokenSymbol: ExtendedSupportedCurrencies.Usdc,
    conversionDenomination: selectedCurrency,
  });
  const conversionRate = selectedCurrencyConversionRate?.conversionRate ?? 0;

  /**
   * Given the fee amount is expressed in dollars, the simplest way is to convert it to USDC
   * so it doesn't depend on the selected currency
   */
  const usdCurrencyConversionRate = useCurrencyConversionRate({
    tokenSymbol: ExtendedSupportedCurrencies.Usdc,
    conversionDenomination: SupportedCurrencies.Usd,
  });
  const usdcConversionRate =
    1 / (usdCurrencyConversionRate?.conversionRate ?? 1);
  const feeType =
    selectedCurrency === SupportedCurrencies.Usd ? FeeType.ACH : FeeType.SEPA;
  const feeAmount = (getFeeAmountBasedOn(feeType) * 1) / usdcConversionRate;

  const withdrawAmount = useWatch({ name: TransferFields.AMOUNT });
  const withdrawAmountValue = parseFloat(
    getUnformattedStringNumeral(withdrawAmount.toString()),
  );

  const { data: bridgeGatewayFeeData, loading: bridgeGatewayFeeLoading } =
    useGetGatewayFeeQuery();
  const gatewayPercentage = bridgeGatewayFeeLoading
    ? 0
    : bridgeGatewayFeeData?.bridgeGetGatewayFee?.transactionFeePercentage ?? 0;
  const gatewayAmount = withdrawAmountValue * gatewayPercentage;

  const receiveAmountInBaseCurrency =
    withdrawAmountValue - gatewayAmount - feeAmount;
  const receiveAmount = getConvertedAmount(
    receiveAmountInBaseCurrency,
    conversionRate,
  );

  return {
    gatewayAmount: getFormattedStringNumeral(gatewayAmount),
    gatewayPercentage,
    feeType,
    feeAmount: getFormattedStringNumeral(feeAmount),
    receiveAmount: getFormattedStringNumeral(receiveAmount, {
      numeralPositiveOnly: false,
    }),
    selectedCurrency,
  };
};
