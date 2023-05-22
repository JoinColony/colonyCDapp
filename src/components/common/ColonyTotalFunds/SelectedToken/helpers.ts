import { Address, Colony, ColonyBalances } from '~types';
import { notNull } from '~utils/arrays';

export const getCurrentToken = (
  tokens: Colony['tokens'],
  currentTokenAddress?: Address,
) => {
  if (tokens) {
    return tokens.items.find(
      (colonyToken) => colonyToken?.token.tokenAddress === currentTokenAddress,
    );
  }
  return undefined;
};

export const getCurrentTokenRootBalance = (
  balances?: ColonyBalances | null,
  tokenAddress?: Address,
): string | undefined => {
  const { balance } =
    balances?.items
      ?.filter(notNull)
      .find(
        ({ domain, token: { tokenAddress: address } }) =>
          domain === null && tokenAddress === address,
      ) ?? {};

  return balance;
};
