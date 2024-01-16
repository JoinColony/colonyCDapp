import { getFormattedNumeralValue } from '~shared/Numeral/helpers';
import { convertToDecimal } from '~utils/convertToDecimal';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

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
