import { DecisionMethod } from '~gql';
import { ActionTypes } from '~redux/index.ts';
import { type Domain, type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import { type EditTeamFormValues } from './consts.ts';

export const getEditDomainPayload = (
  colony: Colony,
  values: EditTeamFormValues,
  selectedDomain: Domain,
) => {
  const baseDomainPayload = {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    domainName: values.teamName,
    domainColor: values.domainColor,
    domainPurpose: values.domainPurpose,
    domain: selectedDomain,
    annotationMessage: values.description
      ? sanitizeHTML(values.description)
      : undefined,
    customActionTitle: values.title,
    isCreateDomain: false,
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

export const getEditDomainFormActionType = (
  decisionMethod: DecisionMethod | undefined,
) => {
  switch (decisionMethod) {
    case DecisionMethod.Reputation:
      return ActionTypes.MOTION_REPUTATION_DOMAIN_CREATE_EDIT;
    case DecisionMethod.MultiSig:
      return ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT;
    default:
      return ActionTypes.ACTION_DOMAIN_EDIT;
  }
};
