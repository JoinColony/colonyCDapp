import { Colony } from '~types';

export const getAddExistingSafeDialogPayload = (
  colony: Colony,
  payload: any,
) => {
  const {
    chainId,
    contractAddress,
    safeName,
    annotation: annotationMessage,
    moduleContractAddress,
  } = payload;

  return {
    colony,
    safes: [
      {
        chainId,
        name: safeName,
        address: contractAddress,
        moduleContractAddress,
      },
    ],
    annotationMessage,
    customActionTitle: '',
  };
};
