import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { type TestContext } from 'yup';

import { type ColonyFragment } from '~gql';
import { notNull } from '~utils/arrays/index.ts';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

export const hasEnoughFundsValidation = (
  value: number | null | undefined,
  context: TestContext<object>,
  selectedTeam: string | undefined,
  colony: ColonyFragment,
  tokenAddress?: string,
) => {
  const { parent } = context;
  const { tokenAddress: tokenAddressFieldValue } = parent || {};

  const colonyTokens =
    colony?.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];

  const selectedToken = colonyTokens.find(
    ({ tokenAddress: selectedTokenAddress }) =>
      selectedTokenAddress === tokenAddressFieldValue || tokenAddress,
  );

  if (!selectedToken?.tokenAddress) {
    return false;
  }

  const tokenBalance = getBalanceForTokenAndDomain(
    colony?.balances,
    selectedToken?.tokenAddress,
    Number(selectedTeam) || Id.RootDomain,
  );

  return !BigNumber.from(
    moveDecimal(
      value || 0,
      getTokenDecimalsWithFallback(selectedToken?.decimals),
    ),
  ).gt(tokenBalance);
};
