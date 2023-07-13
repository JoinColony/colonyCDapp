import { Colony } from '~types';

export const getRemoveSafeDialogPayload = (colony: Colony, payload: any) => {
  const { safeList, annotation: annotationMessage } = payload;

  return {
    colonyName: colony.name,
    colonyAddress: colony.colonyAddress,
    safeList,
    annotationMessage,
    isRemovingSafes: true,
  };
};
