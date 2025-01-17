import numbro from 'numbro';
import React from 'react';

import { convertToDecimal } from '~utils/convertToDecimal.ts';

import { getFormattedCurrencyValue } from './helpers.tsx';
import numbroLanguage from './numbroLanguage.ts';
import { NumeralBase } from './NumeralBase.tsx';
import { type NumeralProps } from './types.ts';

// needed for capitalized abbreviations
numbro.registerLanguage(numbroLanguage);
numbro.setLanguage('en-GB');

const displayName = 'NumeralCurrency';

const NumeralCurrency = ({
  value,
  decimals,
  prefix,
  suffix,
  className,
  ...rest
}: NumeralProps) => {
  const convertedValue = convertToDecimal(value, decimals || 0);

  const formattedValue = getFormattedCurrencyValue(convertedValue, value);

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

NumeralCurrency.displayName = displayName;

export { NumeralCurrency };
