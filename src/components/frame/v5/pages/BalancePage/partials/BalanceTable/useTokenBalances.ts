import { BigNumber } from 'ethers';

import { TokenFragment } from '~gql';
import { useColonyContext, useGetSelectedDomainFilter } from '~hooks';
import { TableSortDirection } from '~hooks/useTableSort';
import { getBalanceForTokenAndDomain } from '~utils/tokens';

import { DEFAULT_BALANCE_DOMAIN_ID } from './consts';
import { BalanceTableSort, BalanceTableSortFields } from './types';

interface TokenBalance {
  token: TokenFragment;
  balance: BigNumber;
}
interface UseTokenBalancesResult {
  data: TokenBalance[];
}

export const useTokenBalances = (
  sort: BalanceTableSort | null,
): UseTokenBalancesResult => {
  const {
    colony: { tokens, balances },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();

  const tokensData = (tokens?.items || []).reduce<TokenBalance[]>(
    (tokenBalances, item) => {
      if (item === null || item.token === null) {
        return tokenBalances;
      }

      const currentTokenBalance = getBalanceForTokenAndDomain(
        balances,
        item.token.tokenAddress,
        selectedDomain
          ? Number(selectedDomain.nativeId)
          : DEFAULT_BALANCE_DOMAIN_ID,
      );

      return [
        ...tokenBalances,
        {
          token: item.token,
          balance: currentTokenBalance,
        },
      ];
    },
    [],
  );

  const sortedTokens = tokensData.sort((a, b) => {
    let modifier = 1;
    if (
      sort !== null &&
      sort.field === BalanceTableSortFields.BALANCE &&
      sort.direction === TableSortDirection.ASC
    ) {
      modifier = -1;
    }

    if (a.balance.lt(b.balance)) {
      return modifier * 1;
    }
    if (a.balance.gt(b.balance)) {
      return modifier * -1;
    }
    return 0;
  });

  return {
    data: sortedTokens,
  };
};
