import classNames from 'classnames';
import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';
import numbro from 'numbro';
import React, { HTMLAttributes } from 'react';

import { convertToDecimal } from '~utils/convertToDecimal';
import { getMainClasses } from '~utils/css';

import { getFormattedNumeralValue } from './helpers';
import numbroLanguage from './numbroLanguage';

import styles from './Numeral.css';

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
  const convertedValue = convertToDecimal(value, decimals || 0);

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
