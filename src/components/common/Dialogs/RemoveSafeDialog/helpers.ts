import { Colony } from '~types';

export const getRemoveSafeDialogPayload = (colony: Colony, payload: any) => {
  const { safes, annotation: annotationMessage } = payload;

  return {
    colony,
    safes: safes.map((safe: string) => JSON.parse(safe)),
    annotationMessage,
    isRemovingSafes: true,
    customActionTitle: '',
  };
};
