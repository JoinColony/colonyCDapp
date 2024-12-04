import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';

import {
  adjustConvertedValue,
  getFormattedNumeralValue,
} from '~shared/Numeral/index.ts';

import { isNumeric } from './numbers.ts';

export enum ZeroValue {
  Zero = '0',
  NearZero = '~0',
}

export type PercentageReputationType = ZeroValue | number | null;

export const DECIMAL_PLACES = 2;

export const calculatePercentageReputation = (
  userReputation?: string,
  totalReputation?: string,
  decimalPlaces = DECIMAL_PLACES,
): PercentageReputationType => {
  if (!userReputation || !totalReputation) return null;
  const userReputationNumber = BigNumber.from(userReputation);
  const totalReputationNumber = BigNumber.from(totalReputation);

  const reputationSafeguard = BigNumber.from(100).pow(decimalPlaces);

  if (userReputationNumber.isZero() || totalReputationNumber.isZero()) {
    return ZeroValue.Zero;
  }

  if (userReputationNumber.mul(reputationSafeguard).lt(totalReputationNumber)) {
    return ZeroValue.NearZero;
  }

  const reputation = userReputationNumber
    .mul(reputationSafeguard)
    .div(totalReputationNumber)
    .toNumber();

  return reputation / 10 ** decimalPlaces;
};

export const formatReputationChange = (
  reputationChange: Decimal.Value,
  decimals: number,
) => {
  const absoluteChange = new Decimal(reputationChange).abs();
  const value = adjustConvertedValue(absoluteChange, decimals);
  return getFormattedNumeralValue(value, absoluteChange);
};

export const getReputationDifference = (
  percentageA: number | ZeroValue,
  percentageB: number | ZeroValue,
) =>
  isNumeric(percentageA) && isNumeric(percentageB)
    ? Math.abs(Number(percentageA) - Number(percentageB))
    : ZeroValue.NearZero;
