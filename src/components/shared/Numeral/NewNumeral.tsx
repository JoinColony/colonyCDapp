import React from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import numbro from 'numbro';

interface Props {
  value: BigNumberish;

  /** If specified, the value will be shifted by the indicated decimals */
  // decimals?: number;
}

const convertToBigNumberOrNull = (value: BigNumberish) => {
  try {
    return BigNumber.from(value);
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

const NewNumeral = ({ value }: Props) => {
  const convertedValue = convertToBigNumberOrNull(value);

  if (!convertedValue) {
    return <div>{value.toString()}</div>;
  }

  let format: numbro.Format = {};

  if (convertedValue.lt(1000)) {
    format = smallNumberFormat;
  }

  if (convertedValue.lt(1_000_000)) {
    format = mediumNumberFormat;
  }

  if (convertedValue.lt(1_000_000_000_000)) {
    format = bigNumberFormat;
  }

  return <div>{numbro(convertedValue.toString()).format(format)}</div>;
};

export default NewNumeral;
