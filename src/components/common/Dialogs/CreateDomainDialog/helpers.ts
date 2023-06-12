import { Colony } from '~types';

export const getCreateDomainDialogPayload = (colony: Colony, payload) => ({
  ...payload,
  domainName: payload.teamName,
  isCreateDomain: true,
  colony,
});
