import React from 'react';

import { type SupportedCurrencies } from '~gql';
import { type SelectOption } from '~v5/common/Fields/Select/types.ts';

import { CurrencyLabel } from '../CurrencyLabel.tsx';

export const CurrencyFormattedOptionLabel = ({ label }: SelectOption) => (
  <CurrencyLabel currency={label as SupportedCurrencies} />
);
