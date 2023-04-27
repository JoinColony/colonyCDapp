import Decimal from 'decimal.js';
import { InferType, boolean, number, object, string } from 'yup';

import { intl } from '~utils/intl';

const { formatMessage } = intl({
  amountZero: 'Amount must be greater than zero',
  maxAmount: "Amount must be less than the user's reputation",
});

const amountValidation = string()
  .required()
  .test(
    'more-than-zero',
    () => formatMessage({ id: 'amountZero' }),
    (value) => {
      const numberWithoutCommas = (value || '0').replace(/,/g, ''); // @TODO: Remove this once the fix for FormattedInputComponent value is introduced.
      return !new Decimal(numberWithoutCommas).isZero();
    },
  );

export const defaultValidationSchema = object()
  .shape({
    domainId: number().required(),
    user: object().shape({
      walletAddress: string().address().required(),
    }),
    amount: amountValidation,
    annotation: string().max(4000),
    forceAction: boolean().defined(),
    motionDomainId: number().defined(),
  })
  .defined();

export const getAmountValidationSchema = (schemaUserReputation: number) =>
  object()
    .shape({
      amount: amountValidation.test(
        'less-than-user-reputation',
        () => formatMessage({ id: 'maxAmount' }),
        (value) => {
          const numberWithoutCommas = (value || '0').replace(/,/g, ''); // @TODO: Remove this once the fix for FormattedInputComponent value is introduced.
          return !new Decimal(numberWithoutCommas).greaterThan(
            schemaUserReputation,
          );
        },
      ),
    })
    .required();

export type FormValues = InferType<typeof defaultValidationSchema>;
