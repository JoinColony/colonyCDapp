import { type Colony } from '~types/graphql.ts';
import { sanitizeHTML } from '~utils/strings.ts';

import { type CreateNewTeamFormValues } from './consts.ts';

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
  annotationMessage: values.description
    ? sanitizeHTML(values.description)
    : undefined,
});
