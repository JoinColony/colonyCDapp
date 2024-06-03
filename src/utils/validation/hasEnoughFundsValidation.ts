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

export const hasEnoughFundsValidation = ({
  value,
  context,
  selectedTeam,
  colony,
  tokenAddress,
  networkInverseFee,
}: {
  value: string | null | undefined;
  context: TestContext<object>;
  selectedTeam: number | undefined;
  colony: Colony;
  tokenAddress?: string;
  networkInverseFee?: string;
}) => {
  if (!value) {
    return false;
  }

  const { parent } = context;
  const { tokenAddress: tokenAddressFieldValue } = parent || {};

  const colonyTokens =
    colony.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];

  const selectedToken = colonyTokens.find(
    ({ tokenAddress: selectedTokenAddress }) =>
      selectedTokenAddress === tokenAddressFieldValue || tokenAddress,
  );

  if (!selectedToken) {
    return false;
  }

  const tokenBalance = getBalanceForTokenAndDomain(
    colony.balances,
    selectedToken.tokenAddress,
    selectedTeam || Id.RootDomain,
  );

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
