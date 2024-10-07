import { DecisionMethod } from '~gql';
import { RootMotionMethodNames } from '~redux/index.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import { type UnlockTokenFormValues } from './consts.ts';

export const getUnlockTokenPayload = (
  colony: Colony,
  values: UnlockTokenFormValues,
) => {
  const { description: annotationMessage, title, decisionMethod } = values;
  const commonPayload = {
    annotationMessage: annotationMessage
      ? sanitizeHTML(annotationMessage)
      : undefined,
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    customActionTitle: title,
  };

  if (
    decisionMethod === DecisionMethod.Reputation ||
    decisionMethod === DecisionMethod.MultiSig
  ) {
    return {
      ...commonPayload,
      operationName: RootMotionMethodNames.UnlockToken,
      colonyRoles: extractColonyRoles(colony.roles),
      colonyDomains: extractColonyDomains(colony.domains),
      motionParams: [],
      isMultiSig: decisionMethod === DecisionMethod.MultiSig,
    };
  }

  return commonPayload;
};
