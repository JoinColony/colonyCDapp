import { type FormatNumeralOptions } from 'cleave-zen';
import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

export const useAmountField = (selectedTokenAddress: string | undefined) => {
  const {
    colony,
    colony: { nativeToken },
  } = useColonyContext();

  const colonyTokens =
    colony.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];

  const selectedToken = getSelectedToken(
    colony,
    selectedTokenAddress || nativeToken.tokenAddress,
  );

  const formattingOptions: FormatNumeralOptions = useMemo(
    () => ({
      delimiter: ',',
      numeralPositiveOnly: true,
      numeralDecimalScale: getTokenDecimalsWithFallback(
        selectedToken?.decimals,
      ),
    }),
    [selectedToken?.decimals],
  );

  return {
    colonyTokens,
    formattingOptions,
    selectedToken,
  };
};
