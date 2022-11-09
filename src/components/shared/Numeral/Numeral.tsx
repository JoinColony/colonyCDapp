import React, { HTMLAttributes, ReactNode, useMemo } from 'react';
import { BigNumber } from 'ethers';
import numbro from 'numbro';
import Decimal from 'decimal.js';
import classNames from 'classnames';

import { getMainClasses } from '~utils/css';

import EngineeringNotation from './EngineeringNotation';
import numbroLanguage from './numbroLanguage';

import styles from './Numeral.css';

// needed for capitalized abbreviations
numbro.registerLanguage(numbroLanguage);
numbro.setLanguage('en-GB');

const displayName = 'Numeral';

type NumeralValue = string | number | BigNumber;

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

const convertToDecimalOrNull = (value: NumeralValue): Decimal | null => {
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
    convertedValue = convertedValue.div(new Decimal(10).pow(decimals));
  }

  const formattedValue = useMemo<ReactNode>(() => {
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
  }, [convertedValue, value]);

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
