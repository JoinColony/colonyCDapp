import { Colony } from '~types';

export const getCreateDomainDialogPayload = (colony: Colony, payload) => ({
  ...payload,
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  domainName: payload.teamName,
  isCreateDomain: true,
});
