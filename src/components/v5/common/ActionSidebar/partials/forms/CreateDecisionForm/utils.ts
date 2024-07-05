import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import { type CreateDecisionFormValues } from './consts.ts';

export const getDecisionPayload = (
  colony: Colony,
  values: CreateDecisionFormValues,
  userAddress: string,
) => {
  const {
    description: annotationMessage,
    title,
    createdIn,
    decisionMethod,
  } = values;
  const safeDescription = sanitizeHTML(annotationMessage || '');

  const payload = {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    decisionMethod,
    motionParams: [],
    colonyRoles: extractColonyRoles(colony.roles),
    colonyDomains: extractColonyDomains(colony.domains),
    isMultiSig: decisionMethod === DecisionMethod.MultiSig,
    draftDecision: {
      motionDomainId: Number(createdIn),
      title,
      description: safeDescription,
      walletAddress: userAddress,
    },
  };

  return payload;
};
