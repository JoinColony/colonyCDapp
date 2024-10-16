import { DecisionMethod } from '~gql';
import { RootMotionMethodNames } from '~redux/index.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import { type UpgradeColonyFormValues } from './consts.ts';

export const getUpgradeColonyPayload = (
  colony: Colony,
  values: UpgradeColonyFormValues,
) => {
  const { description: annotationMessage, title, decisionMethod } = values;

  const commonPayload = {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    version: colony.version,
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
      operationName: RootMotionMethodNames.Upgrade,
      colonyRoles: extractColonyRoles(colony.roles),
      colonyDomains: extractColonyDomains(colony.domains),
      motionParams: [colony.version + 1],
      isMultiSig: decisionMethod === DecisionMethod.MultiSig,
    };
  }

  return commonPayload;
};
