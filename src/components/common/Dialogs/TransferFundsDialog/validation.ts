import { BigNumber } from 'ethers';
import { defineMessages } from 'react-intl';
import { boolean, number, object, string, TestContext } from 'yup';
import moveDecimal from 'move-decimal-point';

import { Colony } from '~types';
import { notNull } from '~utils/arrays';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';
import { toFinite } from '~utils/lodash';

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

const getHasEnoughBalanceTestFn = (colony: Colony) => {
  const colonyBalances = colony.balances?.items?.filter(notNull) || [];
  return (value: number | undefined, context: TestContext) => {
    if (!value) {
      return true;
    }

    const { fromDomainId, tokenAddress } = context.parent;
    const selectedDomainBalance = colonyBalances.find(
      (balance) =>
        balance.token.tokenAddress === tokenAddress &&
        balance.domain.nativeId === fromDomainId,
    );
    const selectedToken = getSelectedToken(colony, tokenAddress);

    if (!selectedDomainBalance || !selectedToken) {
      return true;
    }

    const tokenDecimals = getTokenDecimalsWithFallback(selectedToken.decimals);
    const convertedAmount = BigNumber.from(moveDecimal(value, tokenDecimals));

    return convertedAmount.lte(selectedDomainBalance.balance);
  };
};

export const getValidationSchema = (colony: Colony) => {
  return object()
    .shape({
      forceAction: boolean().defined(),
      fromDomainId: number().required(),
      toDomainId: number()
        .required()
        .when('fromDomainId', (fromDomainId, schema) =>
          schema.notOneOf([fromDomainId], MSG.sameDomain),
        ),
      amount: number()
        .required()
        .transform((value) => toFinite(value))
        .moreThan(0, () => MSG.amountZero)
        .test(
          'not-enough-balance',
          () => MSG.notEnoughBalance,
          getHasEnoughBalanceTestFn(colony),
        ),
      tokenAddress: string().address().required(),
      annotation: string().max(4000).defined(),
    })
    .defined();
};
