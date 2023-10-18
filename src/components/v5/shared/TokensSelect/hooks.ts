import { useMemo } from 'react';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';

export const useTokenField = (selectedTokenAddress: string) => {
  const { colony } = useColonyContext();

  const colonyTokens =
    colony?.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];

  const selectedToken = colony
    ? getSelectedToken(colony, selectedTokenAddress)
    : undefined;

  const formattingOptions = useMemo(
    () => ({
      delimiter: ',',
      numeral: true,
      numeralPositiveOnly: true,
      numeralDecimalScale: getTokenDecimalsWithFallback(
        selectedToken?.decimals,
      ),
    }),
    [selectedToken],
  );

  return {
    colonyTokens,
    formattingOptions,
    selectedToken,
  };
};
