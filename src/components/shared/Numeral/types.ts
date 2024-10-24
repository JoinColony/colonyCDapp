import { type BigNumber } from 'ethers';
import { type HTMLAttributes } from 'react';

import type Decimal from 'decimal.js';

export type NumeralValue = string | number | BigNumber | Decimal;

export interface Appearance {
  theme?: 'dark';
  size?: 'small';
}

export interface NumeralProps extends HTMLAttributes<HTMLSpanElement> {
  value: NumeralValue;
  prefix?: string;
  suffix?: string;
  className?: string;

  /** If specified, the value will be shifted by the indicated decimals */
  decimals?: number;
}
