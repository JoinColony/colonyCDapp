import {
  adjustConvertedValue,
  convertToDecimalOrNull,
} from '~shared/Numeral/index.ts';
import { type NumeralValue } from '~shared/Numeral/types.ts';

import type Decimal from 'decimal.js';

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
