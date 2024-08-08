import { getFormattedNumeralValue } from '~shared/Numeral/helpers.tsx';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

export const getFormattedTokenAmount = (
  amount: string,
  tokenDecimals?: number,
): string | JSX.Element => {
  const convertedValue = convertToDecimal(
    amount,
    getTokenDecimalsWithFallback(tokenDecimals),
  );

  const formattedValue = getFormattedNumeralValue(convertedValue, amount);

  return formattedValue;
};
