import { string, object, number, boolean } from 'yup';
import { defineMessages } from 'react-intl';

import { toFinite } from '~utils/lodash';
import { Colony } from '~types';
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

const getValidationSchema = (colony: Colony, networkInverseFee: string | undefined) =>
  object()
    .shape({
      fromDomainId: number().required(),
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
        .test('has-enough-balance', () => MSG.noBalance, getHasEnoughBalanceTestFn(colony, networkInverseFee)),
      tokenAddress: string().address().required(),
      annotation: string().max(4000).defined(),
      forceAction: boolean().defined(),
      motionDomainId: number().defined(),
    })
    .defined();

export default getValidationSchema;
