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
  appearance,
  ...rest
}: NumeralProps) => {
  const fixedValue = value;
  const convertedValue = convertToDecimal(fixedValue, decimals || 0);

  const formattedValue = getFormattedCurrencyValue(convertedValue, fixedValue);

  return (
    <NumeralBase
      prefix={prefix}
      suffix={suffix}
      className={className}
      appearance={appearance}
      {...rest}
    >
      {formattedValue}
    </NumeralBase>
  );
};

NumeralCurrency.displayName = displayName;

export { NumeralCurrency };
