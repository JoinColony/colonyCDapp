import Decimal from 'decimal.js';
import { BigNumber, BigNumberish } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { Colony, Address, ColonyBalances } from '~types';
import {
  DEFAULT_TOKEN_DECIMALS,
  COLONY_TOTAL_BALANCE_DOMAIN_ID,
} from '~constants';

import { notNull } from './arrays';

export const getBalanceForTokenAndDomain = (
  balances: ColonyBalances | null | undefined,
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

  return BigNumber.from(currentDomainBalance?.balance ?? 0);
};

/*
 * @NOTE Don't trust the incoming decimals
 *
 * The incoming decimals can be virtually anything, so we have to test if it's
 * a number, and return that number (even if that number is 0).
 * If it's not a number then fallback to the default token decimals value.
 */
export const getTokenDecimalsWithFallback = (decimals: any, fallbackDecimals?: any): number => {
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
export const getFormattedTokenValue = (value: BigNumberish, decimals: any): string => {
  const tokenDecimals = new Decimal(getTokenDecimalsWithFallback(decimals));

  return new Decimal(value.toString()).div(new Decimal(10).pow(tokenDecimals)).toString();
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
  const totalToPayInWei = BigNumber.from(amountInWei).add(1).mul(feeInverse).div(BigNumber.from(feeInverse).sub(1));
  const feesInWei = totalToPayInWei.sub(amountInWei);
  return {
    feesInWei: feesInWei.toString(),
    totalToPay: moveDecimal(totalToPayInWei, -1 * decimals),
  }; // NOTE: seems like moveDecimal does not have strict typing
};

export const getSelectedToken = (colony: Colony, tokenAddress: string) => {
  const colonyTokens = colony?.tokens?.items.filter(notNull).map((colonyToken) => colonyToken.token) || [];
  const selectedToken = colonyTokens.find((token) => token?.tokenAddress === tokenAddress);
  return selectedToken;
};
