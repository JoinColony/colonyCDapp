import classNames from 'classnames';
import { type BigNumber } from 'ethers';
import numbro from 'numbro';
import React, { type HTMLAttributes } from 'react';

import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { getMainClasses } from '~utils/css/index.ts';

import { getFormattedNumeralValue } from './helpers.tsx';
import numbroLanguage from './numbroLanguage.ts';

import type Decimal from 'decimal.js';

import styles from './Numeral.module.css';

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
  appearance?: Appearance;
  format?: numbro.Format;

  /** If specified, the value will be shifted by the indicated decimals */
  decimals?: number;
}

const Numeral = ({
  value,
  decimals,
  prefix,
  suffix,
  className,
  appearance,
  format,
  ...rest
}: Props) => {
  const convertedValue = convertToDecimal(value, decimals || 0);

  const formattedValue = getFormattedNumeralValue(
    convertedValue,
    value,
    format,
  );

  return (
    <span
      className={classNames(getMainClasses(appearance, styles), className)}
      {...rest}
    >
      {prefix && `${prefix} `}
      {formattedValue}
      {suffix}
    </span>
  );
};

Numeral.displayName = displayName;

export default Numeral;
