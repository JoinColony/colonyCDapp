import React from 'react';
import Decimal from 'decimal.js';
import numbro from 'numbro';

const displayName = 'Numeral.EngineeringNotation';

interface Props {
  value: Decimal;
}

const EngineeringNotation = ({ value }: Props) => {
  const format: numbro.Format = {
    totalLength: 6,
    trimMantissa: true,
    exponential: false,
  };

  const decimals = value.log(10).floor();
  // positive exponents (for numbers >= 1 trillion) should be multiplies of 3
  const power = decimals.lt(0) ? decimals : decimals.minus(decimals.mod(3));
  const coefficient = value.div(new Decimal(10).pow(power));

  return (
    <>
      {numbro(coefficient.toString()).format(format)}×10
      <sup>{power.toString()}</sup>
    </>
  );
};

EngineeringNotation.displayName = displayName;

export default EngineeringNotation;
