import type Decimal from 'decimal.js';
import type numbro from 'numbro';

const FORMAT = {
  SMALL: {
    mantissa: 2,
    thousandSeparated: true,
  },
  BIG: {
    totalLength: 6,
    trimMantissa: true,
    roundingFunction: (num: number) => num,
  },
} as const;

const THRESHOLD = 10_000_000;

export const getCurrencyFormatByDecimal = (
  convertedValue: Decimal | null,
): numbro.Format => {
  if (!convertedValue) return FORMAT.SMALL;
  return convertedValue.lt(THRESHOLD) ? FORMAT.SMALL : FORMAT.BIG;
};
