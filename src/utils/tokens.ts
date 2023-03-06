import Decimal from 'decimal.js';
import { BigNumber, BigNumberish } from 'ethers';
import { ColonyBalances } from '~gql';
import { Address } from '~types';

import {
  DEFAULT_TOKEN_DECIMALS,
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
} from '~constants';

export const getBalnceForTokenAndDomain = (
  balances: ColonyBalances,
  tokenAddress: Address,
  domainId: number = COLONY_TOTAL_BALANCE_DOMAIN_ID,
) => {
  const currentDomainBalance = balances?.items
    ?.filter((domainBalance) =>
      domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID
        ? domainBalance?.domain === null
        : domainBalance?.domain?.nativeId === domainId,
    )
    .find(
      (domainBalance) => domainBalance?.token?.tokenAddress === tokenAddress,
    );
  return BigNumber.from(currentDomainBalance?.balance);
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

/**
 * Get value with its decimal point shifted by @param decimals places
 */
export const getFormattedTokenValue = (
  value: BigNumberish,
  decimals: any,
): string => {
  const tokenDecimals = new Decimal(getTokenDecimalsWithFallback(decimals));

  return new Decimal(value.toString())
    .div(new Decimal(10).pow(tokenDecimals))
    .toString();
};
