import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { getAmountLessFee } from '~utils/getAmountLessFee.ts';

export const useAmountLessFee = (
  amount?: string | null,
  networkFee?: string | null,
): string => {
  const { networkInverseFee } = useNetworkInverseFee();

  return getAmountLessFee(amount, networkFee, networkInverseFee);
};
