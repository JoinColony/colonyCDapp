import { type Colony, type Domain } from '~types/graphql.ts';

import { type EditTeamFormValues } from './consts.ts';

export const getEditDomainPayload = (
  colony: Colony,
  values: EditTeamFormValues,
  selectedDomain: Domain,
) => ({
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  domainName: values.teamName,
  domainColor: values.domainColor,
  domainPurpose: values.domainPurpose,
  domain: selectedDomain,
  annotationMessage: values.description,
  customActionTitle: values.title,
  motionDomainId: values.createdIn,
  isCreateDomain: false,
});
