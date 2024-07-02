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
  amountGreaterThanTwenty: {
    id: 'common.Extensions.UserHub.partials.TransferForm.amountGreaterThanTwenty',
    defaultMessage: 'Minimum withdraw amount is 20 USDC',
  },
});

export const useTransferForm = () => {
  const validationSchema: ObjectSchema<TransferFormValues> = object()
    .shape({
      amount: number()
        .test(
          'amount-more-than-twenty',
          formatText(MSG.amountGreaterThanTwenty),
          (value) => {
            if (!value) {
              return false;
            }

            return value > 20;
          },
        )
        // @TODO: Add test for amount is not greater than balance
        .required(formatText(MSG.amountRequired)),
      convertedAmount: number(),
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
