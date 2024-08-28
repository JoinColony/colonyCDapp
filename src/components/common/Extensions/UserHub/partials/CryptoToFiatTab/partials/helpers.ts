import {
  formatNumeral,
  unformatNumeral,
  type FormatNumeralOptions,
} from 'cleave-zen';

import { mapPayload, pipe } from '~utils/actions.ts';

import { FeeType } from './types.ts';

export const getTransferTransformFn = ({
  userAddress,
}: {
  userAddress: string;
}) =>
  pipe(
    mapPayload(({ amount }) => {
      return {
        userAddress,
        amount,
        // @TODO: Uncomment this when saga is ready
        // } as CryptoToFiatTransferActionPayload;
      } as unknown;
    }),
  );

export const getConvertedAmount = (amount: number, conversionRate: number) => {
  return amount * conversionRate;
};

export const getUnconvertedAmount = (
  amount: number,
  conversionRate: number,
) => {
  return amount / conversionRate;
};

export const getUnformattedStringNumeral = (value: string | number) =>
  unformatNumeral(typeof value === 'number' ? value.toString() : value);
export const getFormattedStringNumeral = (
  value: string | number,
  options: FormatNumeralOptions = {},
) =>
  formatNumeral(typeof value === 'number' ? value.toString() : value, {
    delimiter: ',',
    numeralPositiveOnly: true,
    numeralDecimalScale: 4,
    numeralDecimalMark: '.',
    ...options,
  });

export const getFeeAmountBasedOn = (type: FeeType) => {
  switch (type) {
    case FeeType.ACH: {
      return 0.5;
    }
    case FeeType.SEPA: {
      return 1;
    }
    case FeeType.Wire: {
      return 20;
    }
    default: {
      return 0;
    }
  }
};
