import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import { type CreateNewTeamFormValues } from './consts.ts';

export const getCreateNewTeamPayload = (
  colony: Colony,
  values: CreateNewTeamFormValues,
) => {
  const baseDomainPayload = {
    ...values,
    domainName: values.teamName,
    isCreateDomain: true,
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    customActionTitle: values.title,
    annotationMessage: values.description
      ? sanitizeHTML(values.description)
      : undefined,
  };

  if (values.decisionMethod === DecisionMethod.Permissions) {
    return baseDomainPayload;
  }

  return {
    ...baseDomainPayload,
    colonyRoles: extractColonyRoles(colony.roles),
    colonyDomains: extractColonyDomains(colony.domains),
    domainCreatedInNativeId: values.createdIn,
  };
};

export const getCreateDomainFormActionType = (
  decisionMethod: DecisionMethod | undefined,
) => {
  switch (decisionMethod) {
    case DecisionMethod.Reputation:
      return ActionTypes.MOTION_REPUTATION_DOMAIN_CREATE_EDIT;
    case DecisionMethod.MultiSig:
      return ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT;
    default:
      return ActionTypes.ACTION_DOMAIN_CREATE;
  }
};
