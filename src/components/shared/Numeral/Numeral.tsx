import React, { HTMLAttributes } from 'react';
import { BigNumber } from 'ethers';
import numbro from 'numbro';
import classNames from 'classnames';
import Decimal from 'decimal.js';

import { getMainClasses } from '~utils/css';

import numbroLanguage from './numbroLanguage';
import {
  adjustConvertedValue,
  convertToDecimalOrNull,
  getFormattedNumeralValue,
} from './helpers';

import styles from './Numeral.css';

// needed for capitalized abbreviations
numbro.registerLanguage(numbroLanguage);
numbro.setLanguage('en-GB');

const displayName = 'Numeral';

export type NumeralValue = string | number | BigNumber | Decimal;

export interface Appearance {
  theme?: 'dark';
}

export interface Props extends HTMLAttributes<HTMLSpanElement> {
  value: NumeralValue;
  prefix?: string;
  suffix?: string;
  className?: string;
  appearance?: Appearance;

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
  ...rest
}: Props) => {
  let convertedValue = convertToDecimalOrNull(value);
  if (convertedValue && decimals) {
    convertedValue = adjustConvertedValue(convertedValue, decimals);
  }

  const formattedValue = getFormattedNumeralValue(convertedValue, value);
  return (
    <span
      className={classNames(getMainClasses(appearance, styles), className)}
      {...rest}
    >
      {prefix && `${prefix} `}
      {formattedValue}
      {suffix && ` ${suffix}`}
    </span>
  );
};

Numeral.displayName = displayName;

export default Numeral;
