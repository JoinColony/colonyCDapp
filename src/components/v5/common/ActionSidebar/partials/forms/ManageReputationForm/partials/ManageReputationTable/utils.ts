import { BigNumber } from 'ethers';

export const calculateNewValue = (
  firstValue: string | undefined,
  secondValue: string,
  isSmite?: boolean,
) =>
  isSmite
    ? BigNumber.from(firstValue || '0')
        .sub(secondValue)
        .toString()
    : BigNumber.from(firstValue || '0')
        .add(secondValue)
        .toString();
