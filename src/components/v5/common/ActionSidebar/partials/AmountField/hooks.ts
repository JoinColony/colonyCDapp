import { type FormatNumeralOptions } from 'cleave-zen';
import { useMemo, useRef } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
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

  const adjustInputWidth = () => {
    if (!inputRef.current || !dropdownRef.current) {
      return;
    }

    const dropdownWidth = dropdownRef.current.offsetWidth;

    inputRef.current.style.width = `${Math.min(
      getInputTextWidth(inputRef.current, { usePlaceholderAsFallback: true }),
      maxWidth || 120,
    )}px`;

    inputRef.current.style.maxWidth = `calc(100% - ${dropdownWidth}px - 12px)`;
  };

  return {
    inputRef,
    dropdownRef,
    colonyTokens,
    adjustInputWidth,
    formattingOptions,
    selectedToken,
  };
};
