import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types/graphql';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { MintTokenFormValues } from './consts';

export const getMintTokenPayload = (
  colony: Colony,
  values: MintTokenFormValues,
) => {
  const {
    amount: { amount: inputAmount },
    description: annotationMessage,
    title,
  } = values;

  const amount = BigNumber.from(
    moveDecimal(
      inputAmount,
      getTokenDecimalsWithFallback(colony?.nativeToken?.decimals),
    ),
  );

  return {
    operationName: RootMotionMethodNames.MintTokens,
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    nativeTokenAddress: colony.nativeToken.tokenAddress,
    motionParams: [amount],
    amount,
    annotationMessage,
    customActionTitle: title,
  };
};
