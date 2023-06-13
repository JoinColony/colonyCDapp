import React from 'react';
import Decimal from 'decimal.js';
import numbro from 'numbro';

import EngineeringNotation from './EngineeringNotation';
import { NumeralValue } from './Numeral';

export const convertToDecimalOrNull = (value: NumeralValue): Decimal | null => {
  try {
    return new Decimal(value.toString());
  } catch {
    return null;
  }
};

const smallNumberFormat: numbro.Format = {
  mantissa: 5,
  trimMantissa: true,
};

const mediumNumberFormat: numbro.Format = {
  mantissa: 2,
  trimMantissa: true,
  thousandSeparated: true,
};

const bigNumberFormat: numbro.Format = {
  totalLength: 6,
  trimMantissa: true,
  roundingFunction(num) {
    return num;
  },
};

export const getFormattedNumeralValue = (
  convertedValue: Decimal | null,
  value: NumeralValue,
) => {
  if (!convertedValue) {
    return value.toString();
  }

  if (
    (convertedValue.gt(0) && convertedValue.lt(0.00001)) ||
    convertedValue.gte(1_000_000_000_000)
  ) {
    return <EngineeringNotation value={convertedValue} />;
  }

  let format: numbro.Format = {};

  if (convertedValue.lt(1000)) {
    format = smallNumberFormat;
  } else if (convertedValue.lt(1_000_000)) {
    format = mediumNumberFormat;
  } else if (convertedValue.lt(1_000_000_000_000)) {
    format = bigNumberFormat;
  }

  if (!numbro.validate(convertedValue.toString(), format)) {
    return value.toString();
  }

  return numbro(convertedValue.toString()).format(format);
};

export const adjustConvertedValue = (
  convertedValue: Decimal,
  decimals: number,
) => convertedValue.div(new Decimal(10).pow(decimals));
