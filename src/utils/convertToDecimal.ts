import Decimal from 'decimal.js';

import { adjustConvertedValue, convertToDecimalOrNull } from '~shared/Numeral';
import { NumeralValue } from '~shared/Numeral/Numeral';

export const convertToDecimal = (
  value: NumeralValue,
  decimals: number,
): Decimal | null => {
  let convertedValue = convertToDecimalOrNull(value);
  if (convertedValue && decimals) {
    convertedValue = adjustConvertedValue(convertedValue, decimals);
  }

  return convertedValue;
};
