import { defineMessages } from 'react-intl';
import { string, object, number, boolean, array } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { Colony } from '~types';
import { toFinite } from '~utils/lodash';
import { getHasEnoughBalanceTestFn } from '~utils/yup/tests';

const displayName = 'common.CreatePaymentDialog';

const MSG = defineMessages({
  requiredFieldError: {
    id: `${displayName}.requiredFieldError`,
    defaultMessage: 'Please enter a value',
  },
  amountZero: {
    id: `${displayName}.amountZero`,
    defaultMessage: 'Amount must be greater than zero',
  },
  noBalance: {
    id: `${displayName}.noBalance`,
    defaultMessage: 'Insufficient balance in team pot',
  },
});

const getValidationSchema = (
  colony: Colony,
  networkInverseFee: string | undefined,
) =>
  object()
    .shape({
      fromDomainId: number().required(),
      payments: array()
        .of(
          object({
            recipient: object()
              .shape({
                walletAddress: string().address().required(),
              })
              .default(undefined)
              .required(() => MSG.requiredFieldError),
            amount: number()
              .required(() => MSG.requiredFieldError)
              .transform((value) => toFinite(value))
              .moreThan(0, () => MSG.amountZero)
              .test(
                'has-enough-balance',
                () => MSG.noBalance,
                getHasEnoughBalanceTestFn(colony, networkInverseFee),
              ),
            tokenAddress: string().address().required(),
          }).defined(),
        )
        .defined(),
      annotation: string().max(MAX_ANNOTATION_LENGTH).defined(),
      forceAction: boolean().defined(),
      motionDomainId: number().defined(),
    })
    .defined();

export default getValidationSchema;
