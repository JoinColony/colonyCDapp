import { useMemo, useRef } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { notNull } from '~utils/arrays/index.ts';
import { getInputTextWidth } from '~utils/elements.ts';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

export const useAmountField = (
  selectedTokenAddress: string,
  name: string,
  maxWidth: number | undefined,
) => {
  const inputRef = useRef<HTMLInputElement>();
  const { colony } = useColonyContext();

  const colonyTokens =
    colony.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];

  const selectedToken = getSelectedToken(colony, selectedTokenAddress);

  const formattingOptions = useMemo(
    () => ({
      name,
      delimiter: ',',
      numeral: true,
      numeralPositiveOnly: true,
      numeralDecimalScale: getTokenDecimalsWithFallback(
        selectedToken?.decimals,
      ),
    }),
    [selectedToken, name],
  );

  const adjustInputWidth = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.style.width = `${Math.min(
      getInputTextWidth(inputRef.current, { usePlaceholderAsFallback: true }),
      maxWidth || 120,
    )}px`;
  };

  const dynamicCleaveOptionKey = JSON.stringify(formattingOptions);

  return {
    inputRef,
    colonyTokens,
    adjustInputWidth,
    dynamicCleaveOptionKey,
    formattingOptions,
    selectedToken,
  };
};
