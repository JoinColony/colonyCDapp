import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';

import {
  adjustConvertedValue,
  getFormattedNumeralValue,
} from '~shared/Numeral';

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
  reputationChange: string,
  decimals: number,
) => {
  const value = adjustConvertedValue(new Decimal(reputationChange), decimals);
  return getFormattedNumeralValue(value, reputationChange);
};
