import { DecisionMethod } from '~types/actions.ts';
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
    return {
      ...baseDomainPayload,
    };
  }

  return {
    ...baseDomainPayload,
    colonyRoles: extractColonyRoles(colony.roles),
    colonyDomains: extractColonyDomains(colony.domains),
    isMultiSig: values.decisionMethod === DecisionMethod.MultiSig,
    motionDomainId: values.createdIn,
  };
};
