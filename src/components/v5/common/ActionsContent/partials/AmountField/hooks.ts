import { useMemo, useState } from 'react';
import { useColonyContext } from '~hooks';
import { Colony } from '~types';
import { notNull } from '~utils/arrays';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';

export const useAmountField = (
  selectedTeam: string | null,
  selectedTokenAddress: string,
) => {
  const { colony } = useColonyContext();
  const [inputWidth, setInputWidth] = useState(0);

  const colonyTokens =
    colony?.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];

  const team = colony?.domains?.items.find((item) => {
    const { metadata } = item || {};
    const { name } = metadata || {};

    return name === selectedTeam;
  });

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
        selectedToken && selectedToken.decimals,
      ),
    }),
    [selectedToken],
  );

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const valueWithoutCommas = value.replace(/,/g, '');
    const width = valueWithoutCommas.length * 10;

    setInputWidth(width);
  };

  const dynamicCleaveOptionKey = JSON.stringify(formattingOptions);

  return {
    colonyTokens,
    team,
    onInput,
    dynamicCleaveOptionKey,
    inputWidth,
    formattingOptions,
    selectedToken,
  };
};
