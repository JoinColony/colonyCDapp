import { BigNumber } from 'ethers';

import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';

export const useAmountLessFee = (
  amount?: string | null,
  networkFee?: string | null,
): string => {
  const { networkInverseFee } = useNetworkInverseFee();

  // If a networkFee has been provided, then we assume the amount already excludes the networkFee
  if (networkFee) {
    return amount || '1';
  }

  const feeNumber = BigNumber.from(networkInverseFee || 1);

  if (!feeNumber.gt(0)) {
    return amount || '1';
  }

  const feePercentage = BigNumber.from(100).div(feeNumber);

  return BigNumber.from(amount || '1')
    .mul(BigNumber.from(100).sub(feePercentage))
    .div(100)
    .toString();
};
