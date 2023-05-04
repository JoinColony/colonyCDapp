import { defineMessages } from 'react-intl';
import { boolean, number, object, string } from 'yup';

import { Colony } from '~types';
import { toFinite } from '~utils/lodash';
import { getHasEnoughBalanceTestFn } from '~utils/yup/tests';

import { displayName } from './TransferFundsDialog';

const MSG = defineMessages({
  amountZero: {
    id: `${displayName}.amountZero`,
    defaultMessage: 'Amount must be greater than zero',
  },
  sameDomain: {
    id: `${displayName}.sameDomain`,
    defaultMessage: 'Cannot move to same team pot',
  },
  notEnoughBalance: {
    id: `${displayName}.notEnoughBalance`,
    defaultMessage: 'Insufficient balance in from team pot',
  },
});

export const getValidationSchema = (colony: Colony) => {
  return object()
    .shape({
      forceAction: boolean().defined(),
      fromDomainId: number().required(),
      toDomainId: number()
        .required()
        .when('fromDomainId', (fromDomainId, schema) => schema.notOneOf([fromDomainId], MSG.sameDomain)),
      amount: number()
        .required()
        .transform((value) => toFinite(value))
        .moreThan(0, () => MSG.amountZero)
        .test('has-enough-balance', () => MSG.notEnoughBalance, getHasEnoughBalanceTestFn(colony)),
      tokenAddress: string().address().required(),
      annotation: string().max(4000).defined(),
    })
    .defined();
};
