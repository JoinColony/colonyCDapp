import { Colony } from '~types';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';

export const getCreatePaymentDialogPayload = (colony: Colony, payload: any) => {
  const {
    amount,
    tokenAddress,
    domainId,
    recipient: { walletAddress },
    annotation: annotationMessage,
    motionDomainId,
  } = payload;
  const selectedToken = getSelectedToken(colony, tokenAddress);

  const decimals = getTokenDecimalsWithFallback(selectedToken?.decimals);

  // const amountWithFees = networkFeeInverse
  //   ? calculateFee(amount, networkFeeInverse, decimals).totalToPay
  //   : amount;

  return {
    colonyName: colony?.name || '',
    colonyAddress: colony?.colonyAddress || '',
    recipientAddress: walletAddress,
    domainId,
    singlePayment: {
      tokenAddress,
      amount, // amountWithFees - @NOTE: The contract only sees this amount
      decimals,
    },
    annotationMessage,
    motionDomainId,
  };
};
