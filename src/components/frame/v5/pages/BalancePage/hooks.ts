import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { getFormattedNumeralValue } from '~shared/Numeral/index.ts';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

import { UseBalancePageReturnType } from './types.ts';

export const useBalancePage = (): UseBalancePageReturnType => {
  const {
    colony: { tokens: colonyTokens, balances },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();

  const tokensData = useMemo(
    () =>
      colonyTokens?.items.map((item) => {
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
    [colonyTokens, balances, selectedDomain],
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
