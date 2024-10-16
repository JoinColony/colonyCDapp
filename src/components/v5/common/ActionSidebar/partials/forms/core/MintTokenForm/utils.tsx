import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { DecisionMethod } from '~gql';
import { RootMotionMethodNames } from '~redux/index.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
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

  if (
    decisionMethod === DecisionMethod.Reputation ||
    decisionMethod === DecisionMethod.MultiSig
  ) {
    return {
      ...commonPayload,
      operationName: RootMotionMethodNames.MintTokens,
      colonyRoles: extractColonyRoles(colony.roles),
      colonyDomains: extractColonyDomains(colony.domains),
      motionParams: [WEIAmount],
      isMultiSig: decisionMethod === DecisionMethod.MultiSig,
    };
  }

  return {
    ...commonPayload,
    amount: WEIAmount,
  };
};
