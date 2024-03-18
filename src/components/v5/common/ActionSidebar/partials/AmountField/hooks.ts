import { type FormatNumeralOptions } from 'cleave-zen';
import { useRef } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { notNull } from '~utils/arrays/index.ts';
import { getInputTextWidth } from '~utils/elements.ts';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

export const useAmountField = (
  selectedTokenAddress: string | undefined,
  maxWidth: number | undefined,
) => {
  const inputRef = useRef<HTMLInputElement>();
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

  const formattingOptions: FormatNumeralOptions = {
    delimiter: ',',
    numeralPositiveOnly: true,
    numeralDecimalScale: getTokenDecimalsWithFallback(selectedToken?.decimals),
  };

  const adjustInputWidth = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.style.width = `${Math.min(
      getInputTextWidth(inputRef.current, { usePlaceholderAsFallback: true }),
      maxWidth || 120,
    )}px`;
  };

  return {
    inputRef,
    colonyTokens,
    adjustInputWidth,
    formattingOptions,
    selectedToken,
  };
};
