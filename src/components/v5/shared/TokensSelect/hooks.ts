import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { getSelectedToken } from '~utils/tokens';

export const useTokenField = (selectedTokenAddress: string) => {
  const { colony } = useColonyContext();

  const colonyTokens =
    colony?.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];

  const selectedToken = colony
    ? getSelectedToken(colony, selectedTokenAddress)
    : undefined;

  return {
    colonyTokens,
    selectedToken,
  };
};
