import { Colony } from '~types';

export const getEditDomainDialogPayload = (colony: Colony, payload) => ({
  ...payload,
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  isCreateDomain: false,
});
