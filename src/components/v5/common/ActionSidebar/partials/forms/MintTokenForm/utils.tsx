import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { RootMotionMethodNames } from '~redux/index.ts';
import { RootMultiSigMethodNames } from '~redux/types/actions/multiSig.ts';
import { DecisionMethod } from '~types/actions.ts';
import { ColonyActionType, type Colony } from '~types/graphql.ts';
import { getMultiSigRequiredRole } from '~utils/multiSig.ts';
import { sanitizeHTML } from '~utils/strings.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import { type MintTokenFormValues } from './consts.ts';

export const getMintTokenPayload = (
  colony: Colony,
  values: MintTokenFormValues,
) => {
  const {
    amount,
    description: annotationMessage,
    title,
    decisionMethod,
  } = values;

  const WEIAmount = BigNumber.from(
    moveDecimal(
      amount,
      getTokenDecimalsWithFallback(colony?.nativeToken?.decimals),
    ),
  );

  const commonPayload = {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    nativeTokenAddress: colony.nativeToken.tokenAddress,
    annotationMessage: annotationMessage
      ? sanitizeHTML(annotationMessage)
      : undefined,
    customActionTitle: title,
  };

  if (decisionMethod === DecisionMethod.Reputation) {
    return {
      ...commonPayload,
      operationName: RootMotionMethodNames.MintTokens,
      motionParams: [WEIAmount],
    };
  }

  if (decisionMethod === DecisionMethod.MultiSig) {
    return {
      ...commonPayload,
      operationName: RootMultiSigMethodNames.MintTokens,
      requiredRole: getMultiSigRequiredRole(
        ColonyActionType.MintTokensMultisig,
      ),
      multiSigParams: [WEIAmount],
    };
  }

  return {
    ...commonPayload,
    amount: WEIAmount,
  };
};
