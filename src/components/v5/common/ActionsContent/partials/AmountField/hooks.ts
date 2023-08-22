import { useMemo, useState } from 'react';
import { useColonyContext } from '~hooks';
import { Colony } from '~types';
import { notNull } from '~utils/arrays';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';

export const useAmountField = (selectedTokenAddress: string) => {
  const { colony } = useColonyContext();
  const [inputWidth, setInputWidth] = useState<number>();

  const colonyTokens =
    colony?.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];

  const selectedToken = getSelectedToken(
    colony as Colony,
    selectedTokenAddress,
  );

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

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const valueWithoutCommas = value.replace(/,/g, '');
    const width = valueWithoutCommas.length * 0.65;

    setInputWidth(width);
  };

  const dynamicCleaveOptionKey = JSON.stringify(formattingOptions);

  return {
    colonyTokens,
    onInput,
    dynamicCleaveOptionKey,
    inputWidth,
    formattingOptions,
    selectedToken,
  };
};
