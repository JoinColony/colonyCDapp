import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { useMemo } from 'react';
import { object, string } from 'yup';

import { useUserTokenBalanceContext } from '~context';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { pipe, mapPayload } from '~utils/actions';
import { formatText } from '~utils/intl';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { TOKENS_MODAL_TYPES } from './consts';
import { TokensModalType, UseTokensModalReturnType } from './types';

export const useTokensModal = (
  type: TokensModalType,
): UseTokensModalReturnType => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
  const { symbol: tokenSymbol } = nativeToken || {};
  const {
    tokenBalanceData: tokenData,
    pollActiveTokenBalance,
    loading,
  } = useUserTokenBalanceContext();
  const { inactiveBalance, activeBalance } = tokenData || {};
  const isActivate = type === TOKENS_MODAL_TYPES.activate;

  const tokenDecimals = useMemo(
    () => getTokenDecimalsWithFallback(nativeToken?.decimals),
    [nativeToken],
  );
  const tokenBalanceData = isActivate ? inactiveBalance : activeBalance;
  const tokenBalanceInEthers = moveDecimal(tokenBalanceData, -tokenDecimals);

  const validationSchema = object()
    .shape({
      amount: string()
        .required(formatText({ id: 'errors.zeroTokens' }))
        .test(
          'amount-test',
          () => formatText({ id: 'errors.notEnoughTokens' }),
          (value) => {
            if (!value) {
              return false;
            }

            try {
              const amount = BigNumber.from(
                moveDecimal(value, nativeToken?.decimals),
              );
              const balance = BigNumber.from(tokenBalanceData);

              if (amount.gt(balance)) {
                return false;
              }

              return amount.gt(0);
            } catch {
              return false;
            }
          },
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
    tokenSymbol,
    pollActiveTokenBalance,
    tokenBalanceInEthers,
    loading,
  };
};
