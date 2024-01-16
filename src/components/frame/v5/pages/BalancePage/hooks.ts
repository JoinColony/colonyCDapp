import { useMemo } from 'react';

import { useColonyContext, useGetSelectedDomainFilter } from '~hooks';
import { getFormattedNumeralValue } from '~shared/Numeral';
import { convertToDecimal } from '~utils/convertToDecimal';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

import { UseBalancePageReturnType } from './types';

export const useBalancePage = (): UseBalancePageReturnType => {
  const { colony } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { balances } = colony || {};

  const tokensData = useMemo(
    () =>
      colony?.tokens?.items.map((item) => {
        const currentTokenBalance =
          getBalanceForTokenAndDomain(
            balances,
            item?.token?.tokenAddress || '',
            selectedDomain ? Number(selectedDomain.nativeId) : undefined,
          ) || 0;
        const decimals = getTokenDecimalsWithFallback(item?.token.decimals);
        const convertedValue = convertToDecimal(
          currentTokenBalance,
          decimals || 0,
        );

        const formattedValue = getFormattedNumeralValue(
          convertedValue,
          currentTokenBalance,
        );

        return {
          ...item,
          balance: typeof formattedValue === 'string' ? formattedValue : '',
        };
      }),
    [colony, balances, selectedDomain],
  );

  const sortedTokens = useMemo(
    () =>
      tokensData?.sort((a, b) => {
        if (!a.balance || !b.balance) return 0;
        return parseInt(b.balance, 10) - parseInt(a.balance, 10);
      }),
    [tokensData],
  );

  return {
    data: sortedTokens || [],
  };
};
