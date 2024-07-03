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
    isMultiSig: values.decisionMethod === DecisionMethod.MultiSig,
  };
};
