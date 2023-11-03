import { useLayoutEffect, useMemo, useState } from 'react';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';

export const useAmountField = (
  selectedTokenAddress: string,
  formValue: string | undefined,
) => {
  const { colony } = useColonyContext();
  const [inputWidth, setInputWidth] = useState<number>();

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

  const adjustInputWidth = (value: string) => {
    const valueWithoutCommas = value.replace(/,/g, '');
    const width = valueWithoutCommas.length * 0.65;

    setInputWidth(width);
  };

  useLayoutEffect(() => {
    if (!formValue) {
      return;
    }

    adjustInputWidth(formValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    adjustInputWidth(value);
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
