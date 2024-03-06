import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { RootMotionMethodNames } from '~redux/index.ts';
import { type Colony } from '~types/graphql.ts';
import { sanitizeHTML } from '~utils/strings/index.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import { type MintTokenFormValues } from './consts.ts';

export const getMintTokenPayload = (
  colony: Colony,
  values: MintTokenFormValues,
) => {
  const { amount, description: annotationMessage, title } = values;

  const WEIAmount = BigNumber.from(
    moveDecimal(
      amount,
      getTokenDecimalsWithFallback(colony?.nativeToken?.decimals),
    ),
  );

  return {
    operationName: RootMotionMethodNames.MintTokens,
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    nativeTokenAddress: colony.nativeToken.tokenAddress,
    motionParams: [WEIAmount],
    amount: WEIAmount,
    annotationMessage: annotationMessage
      ? sanitizeHTML(annotationMessage)
      : undefined,
    customActionTitle: title,
  };
};
