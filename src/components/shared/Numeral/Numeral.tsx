import { type BigNumber } from 'ethers';
import numbro from 'numbro';
import React, { type HTMLAttributes } from 'react';

import { convertToDecimal } from '~utils/convertToDecimal.ts';

import { getFormattedNumeralValue } from './helpers.tsx';
import numbroLanguage from './numbroLanguage.ts';

import type Decimal from 'decimal.js';

// needed for capitalized abbreviations
numbro.registerLanguage(numbroLanguage);
numbro.setLanguage('en-GB');

const displayName = 'Numeral';

export type NumeralValue = string | number | BigNumber | Decimal;

export interface Appearance {
  theme?: 'dark';
  size?: 'small';
}

export interface Props extends HTMLAttributes<HTMLSpanElement> {
  value: NumeralValue;
  prefix?: string;
  suffix?: string;
  className?: string;

  /** If specified, the value will be shifted by the indicated decimals */
  decimals?: number;
}

const Numeral = ({
  value,
  decimals,
  prefix,
  suffix,
  className,
  ...rest
}: Props) => {
  const convertedValue = convertToDecimal(value, decimals || 0);

  const formattedValue = getFormattedNumeralValue(convertedValue, value);

  return (
    <span className={className} {...rest}>
      {prefix && `${prefix} `}
      {formattedValue}
      {suffix}
    </span>
  );
};

Numeral.displayName = displayName;

export default Numeral;
