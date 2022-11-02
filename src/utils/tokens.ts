import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

// import { TokenWithBalances } from '~data/index';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

export const getBalanceFromToken = (
  // token: TokenWithBalances | undefined,
  token: any,
  tokenDomainId = 0,
) => {
  let result;
  if (!token) return BigNumber.from(0);
  if ('balances' in token) {
    const domainBalance = token.balances.find(
      ({ domainId }) => domainId === tokenDomainId,
    );
    result = domainBalance ? domainBalance.amount : 0;
  } else if ('processedBalances' in token) {
    const domainBalance = token.processedBalances.find(
      ({ domainId }) => domainId === tokenDomainId,
    );
    result = domainBalance ? domainBalance.amount : 0;
  } else if ('balance' in token) {
    result = token.balance;
  } else {
    result = 0;
  }
  return BigNumber.from(result);
};

/*
 * @NOTE Don't trust the incoming decimals
 *
 * The incoming decimals can be virtually anything, so we have to test if it's
 * a number, and return that number (even if that number is 0).
 * If it's not a number then fallback to the default token decimals value.
 */
export const getTokenDecimalsWithFallback = (
  decimals: any,
  fallbackDecimals?: any,
): number => {
  if (Number.isInteger(decimals) && decimals >= 0) {
    return decimals;
  }
  if (Number.isInteger(fallbackDecimals) && fallbackDecimals >= 0) {
    return fallbackDecimals;
  }
  return DEFAULT_TOKEN_DECIMALS;
};

export const getFormattedTokenValue = (
  value: BigNumberish,
  decimals: any,
): string => {
  const tokenDecimals = getTokenDecimalsWithFallback(decimals);

  return formatUnits(value, tokenDecimals);
};
