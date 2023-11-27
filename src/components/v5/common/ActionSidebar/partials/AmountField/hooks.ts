import { useMemo, useRef } from 'react';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { getInputTextWidth } from '~utils/elements';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';

export const useAmountField = (
  selectedTokenAddress: string,
  name: string,
  maxWidth: number | undefined,
) => {
  const inputRef = useRef<HTMLInputElement>();
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
