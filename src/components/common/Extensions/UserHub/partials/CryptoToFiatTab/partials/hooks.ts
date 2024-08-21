import { defineMessages } from 'react-intl';
import { type ObjectSchema, object, number } from 'yup';

import { pipe, mapPayload } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';

import { type TransferFormValues } from './types.ts';

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
        amount,
      };
    }),
  );

  return {
    transform,
    validationSchema,
  };
};
