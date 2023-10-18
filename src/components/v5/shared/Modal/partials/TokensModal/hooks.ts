import * as yup from 'yup';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { useMemo } from 'react';
import { useColonyContext } from '~hooks';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { formatText } from '~utils/intl';
import { TOKENS_MODAL_TYPES } from './consts';
import { ActionTypes } from '~redux';
import { pipe, mapPayload } from '~utils/actions';
import { useUserTokenBalanceContext } from '~context';
import { TokensModalType } from './types';

export const useTokensModal = (type: TokensModalType) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
  const { symbol: tokenSymbol } = nativeToken || {};
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
        .string()
        .required(() => formatText({ id: 'errors.zeroTokens' }))
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
    tokenSymbol,
    pollActiveTokenBalance,
    tokenBalanceInEthers,
    loading,
  };
};
