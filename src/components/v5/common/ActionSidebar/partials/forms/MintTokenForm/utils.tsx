import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { RootMotionMethodNames } from '~redux/index.ts';
import { type Colony } from '~types/graphql.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import { type MintTokenFormValues } from './consts.ts';

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
