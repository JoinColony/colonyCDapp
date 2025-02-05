import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { type TestContext } from 'yup';

import { type Colony } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  calculateFee,
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

interface HasEnoughFundsValidationParams {
  // Amount in ETH
  value: string | null | undefined;
  context: TestContext<object>;
  domainId: number | undefined;
  colony: Colony;
  tokenAddress?: string;
  // If specified, fee will be calculated and added to the amount
  networkInverseFee?: string;
}

export const hasEnoughFundsValidation = ({
  value,
  context,
  domainId,
  colony,
  tokenAddress,
  networkInverseFee,
}: HasEnoughFundsValidationParams) => {
  if (!value) {
    return false;
  }
  const { parent } = context;
  const { tokenAddress: tokenAddressFieldValue, chain: chainId } = parent || {};

  const colonyTokens =
    colony.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];

  const selectedToken = colonyTokens.find(
    ({
      tokenAddress: selectedTokenAddress,
      chainMetadata: { chainId: selectedChainId },
    }) =>
      (selectedTokenAddress === tokenAddressFieldValue || tokenAddress) &&
      selectedChainId === chainId,
  );

  if (!selectedToken) {
    return false;
  }

  const tokenBalance = getBalanceForTokenAndDomain({
    balances: colony.balances,
    tokenAddress: selectedToken.tokenAddress,
    tokenChainId: selectedToken.chainMetadata.chainId,
    domainId: domainId || Id.RootDomain,
  });

  const tokenDecimals = getTokenDecimalsWithFallback(selectedToken.decimals);

  let amountInWei = moveDecimal(value, tokenDecimals);

  if (networkInverseFee) {
    const { totalToPay } = calculateFee(
      value,
      networkInverseFee,
      tokenDecimals,
    );
    amountInWei = totalToPay;
  }

  return !BigNumber.from(amountInWei).gt(tokenBalance);
};
