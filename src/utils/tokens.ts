import Decimal from 'decimal.js';
import { BigNumber, BigNumberish } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';

export const getBalanceFromToken = (
  /** @TODO: add proper type */
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

// NOTE: The equation to calculate totalToPay is as following (in Wei)
// totalToPay = (receivedAmount + 1) * (feeInverse / (feeInverse -1))
// The network adds 1 wei extra fee after the percentage calculation
// For more info check out
// https://github.com/JoinColony/colonyNetwork/blob/806e4d5750dc3a6b9fa80f6e007773b28327c90f/contracts/colony/ColonyFunding.sol#L656

export const calculateFee = (
  receivedAmount: string, // amount that the recipient finally receives
  feeInverse: string,
  decimals: number,
): { feesInWei: string; totalToPay: string } => {
  const amountInWei = moveDecimal(receivedAmount, decimals);
  const totalToPayInWei = BigNumber.from(amountInWei)
    .add(1)
    .mul(feeInverse)
    .div(BigNumber.from(feeInverse).sub(1));
  const feesInWei = totalToPayInWei.sub(amountInWei);
  return {
    feesInWei: feesInWei.toString(),
    totalToPay: moveDecimal(totalToPayInWei, -1 * decimals),
  }; // NOTE: seems like moveDecimal does not have strict typing
};
