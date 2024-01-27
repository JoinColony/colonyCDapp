import { Colony } from '~types/graphql.ts';

import { CreateNewTeamFormValues } from './consts.ts';

export const getCreateNewTeamPayload = (
  colony: Colony,
  values: CreateNewTeamFormValues,
) => ({
  ...values,
  domainName: values.teamName,
  isCreateDomain: true,
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  customActionTitle: values.title,
  motionDomainId: values.createdIn,
  annotationMessage: values.description,
});
