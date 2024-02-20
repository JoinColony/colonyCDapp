import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { useColonyExpenditureBalances } from '~hooks/useColonyExpenditureBalances.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { notNull } from '~utils/arrays/index.ts';
import { getBalanceForTokenAndDomain } from '~utils/tokens.ts';

import { type UseBalancePageReturnType } from './types.ts';

export const useBalancePage = (): UseBalancePageReturnType => {
  const {
    colony: { tokens: colonyTokens, balances },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { balancesByToken: expenditureBalances } =
    useColonyExpenditureBalances();

  const tokensData = useMemo(
    () =>
      colonyTokens?.items.filter(notNull).map((item) => {
        // Add balance currently held in expenditures for the current token
        const currentTokenBalance = getBalanceForTokenAndDomain(
          balances,
          item?.token?.tokenAddress || '',
          selectedDomain ? Number(selectedDomain.nativeId) : undefined,
        ).add(expenditureBalances[item?.token?.tokenAddress] ?? 0);

        return {
          ...item,
          balance: currentTokenBalance,
        };
      }),
    [colonyTokens?.items, balances, selectedDomain, expenditureBalances],
  );

  const sortedTokens = useMemo(
    () =>
      tokensData?.sort((a, b) => {
        if (!a.balance || !b.balance || a.balance.eq(b.balance)) return 0;

        return a.balance.gt(b.balance) ? -1 : 1;
      }),
    [tokensData],
  );

  return {
    data: sortedTokens || [],
  };
};
