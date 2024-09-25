import numbro from 'numbro';
import React from 'react';

import { convertToDecimal } from '~utils/convertToDecimal.ts';

import { getFormattedNumeralValue } from './helpers.tsx';
import numbroLanguage from './numbroLanguage.ts';
import { NumeralBase } from './NumeralBase.tsx';
import { type NumeralProps } from './types.ts';

// needed for capitalized abbreviations
numbro.registerLanguage(numbroLanguage);
numbro.setLanguage('en-GB');

const displayName = 'Numeral';

const Numeral = ({
  value,
  decimals,
  prefix,
  suffix,
  className,
  ...rest
}: NumeralProps) => {
  const convertedValue = convertToDecimal(value, decimals || 0);

  const formattedValue = getFormattedNumeralValue(convertedValue, value);

  return (
    <NumeralBase
      prefix={prefix}
      suffix={suffix}
      className={className}
      {...rest}
    >
      {formattedValue}
    </NumeralBase>
  );
};

Numeral.displayName = displayName;

export default Numeral;
