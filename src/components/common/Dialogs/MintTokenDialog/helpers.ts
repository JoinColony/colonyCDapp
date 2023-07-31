import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

export const getMintTokenDialogPayload = (
  colony: Colony,
  { mintAmount: inputAmount, annotation: annotationMessage },
) => {
  // Find the selected token's decimals
  const amount = BigNumber.from(
    moveDecimal(
      inputAmount,
      getTokenDecimalsWithFallback(colony?.nativeToken?.decimals),
    ),
  );
  return {
    operationName: RootMotionMethodNames.MintTokens,
    colonyAddress: colony?.colonyAddress,
    colonyName: colony?.name,
    nativeTokenAddress: colony?.nativeToken?.tokenAddress,
    motionParams: [amount],
    amount,
    annotationMessage,
  };
};
