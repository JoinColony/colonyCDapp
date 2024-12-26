import { DecisionMethod } from '~types/actions.ts';
import { type Colony } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { ManageEntityOperation } from '~v5/common/ActionSidebar/consts.ts';

import { type ManageSupportedChainsFormValues } from './consts.ts';

export const getManageSupportedChainsPayload = (
  colony: Colony,
  values: ManageSupportedChainsFormValues,
) => {
  const baseDomainPayload = {
    operation:
      values.manageSupportedChains === ManageEntityOperation.Add
        ? ManageEntityOperation.Add
        : ManageEntityOperation.Remove,
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    customActionTitle: values.title,
    annotationMessage: values.description,
    creationSalt: colony.colonyCreateEvent?.creationSalt,
    foreignChainId: Number(values.chain),
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
