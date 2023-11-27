import { Colony } from '~types';

export const getCreateDomainDialogPayload = (colony: Colony, payload) => ({
  ...payload,
  domainName: payload.teamName,
  isCreateDomain: true,
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  customActionTitle: '',
});
