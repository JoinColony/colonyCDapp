import * as yup from 'yup';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { useMemo } from 'react';
import { useColonyContext } from '~hooks';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { formatText } from '~utils/intl';
import { toFinite } from '~utils/lodash';
import { TOKENS_MODAL_TYPES } from './consts';
import { ActionTypes } from '~redux';
import { pipe, mapPayload } from '~utils/actions';
import { useUserTokenBalanceContext } from '~context';
import { TokensModalType } from './types';

export const useTokensModal = (type: TokensModalType) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
  const {
    tokenBalanceData: tokenData,
    pollActiveTokenBalance,
    loading,
  } = useUserTokenBalanceContext();
  const { inactiveBalance, lockedBalance } = tokenData || {};
  const isActivate = type === TOKENS_MODAL_TYPES.activate;

  const tokenDecimals = useMemo(
    () => getTokenDecimalsWithFallback(nativeToken?.decimals),
    [nativeToken],
  );
  const tokenBalanceData = isActivate ? inactiveBalance : lockedBalance;
  const tokenBalanceInEthers = moveDecimal(tokenBalanceData, -tokenDecimals);

  const validationSchema = yup
    .object()
    .shape({
      amount: yup
        .number()
        .required(() => formatText({ id: 'errors.amount' }))
        .transform((value) => toFinite(value))
        .moreThan(0, () => 'Amount must be greater than zero')
        .lessThan(
          tokenBalanceInEthers,
          () => `Amount must be less than ${tokenBalanceInEthers}`,
        ),
    })
    .defined();

  const transform = pipe(
    mapPayload(({ amount }) => {
      // Convert amount string with decimals to BigInt (eth to wei)
      const formattedAmount = BigNumber.from(
        moveDecimal(amount, nativeToken?.decimals),
      );

      return {
        amount: formattedAmount,
        colonyAddress: colony?.colonyAddress,
        tokenAddress: nativeToken?.tokenAddress,
      };
    }),
  );

  const actionType = isActivate
    ? ActionTypes.USER_DEPOSIT_TOKEN
    : ActionTypes.USER_WITHDRAW_TOKEN;

  return {
    validationSchema,
    actionType,
    transform,
    tokenBalanceData,
    tokenDecimals,
    nativeToken,
    pollActiveTokenBalance,
    tokenBalanceInEthers,
    loading,
  };
};
