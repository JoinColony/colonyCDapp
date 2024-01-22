import { TokenFragment } from '~gql';
import { useColonyContext, useGetSelectedDomainFilter } from '~hooks';
import { getFormattedNumeralValue } from '~shared/Numeral';
import { convertToDecimal } from '~utils/convertToDecimal';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

interface TokenBalance {
  token: TokenFragment;
  balance: string | JSX.Element;
}
export interface UseTokenBalancesResult {
  data: TokenBalance[];
}

export const useTokenBalances = (): UseTokenBalancesResult => {
  const {
    colony: { tokens, balances },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();

  const tokensData = (tokens?.items || []).reduce<TokenBalance[]>(
    (tokenBalances, item) => {
      if (item === null || item.token === null) {
        return tokenBalances;
      }

      const currentTokenBalance =
        getBalanceForTokenAndDomain(
          balances,
          item.token.tokenAddress,
          selectedDomain ? Number(selectedDomain.nativeId) : undefined,
        ) || 0;
      const decimals = getTokenDecimalsWithFallback(item?.token.decimals);
      const convertedValue = convertToDecimal(
        currentTokenBalance,
        decimals || 0,
      );

      const balance = getFormattedNumeralValue(
        convertedValue,
        currentTokenBalance,
      );

      return [
        ...tokenBalances,
        {
          token: item.token,
          balance,
        },
      ];
    },
    [],
  );

  const sortedTokens = tokensData.sort((a, b) => {
    // @NOTE this is due to the  getFormattedNumeralValue possibly returning JSX
    if (typeof a.balance !== 'string' || typeof b.balance !== 'string')
      return 0;
    return parseInt(b.balance, 10) - parseInt(a.balance, 10);
  });

  return {
    data: sortedTokens,
  };
};
