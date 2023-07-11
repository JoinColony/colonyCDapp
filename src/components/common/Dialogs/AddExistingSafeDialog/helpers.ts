import { SUPPORTED_SAFE_NETWORKS } from '~constants';
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
    safeList: [
      {
        chainId,
        name: safeName,
        address: contractAddress,
        moduleContractAddress,
      },
    ],
    annotationMessage,
  };
};

export const getTxServiceBaseUrl = (selectedChain: string) => {
  const selectedNetwork = SUPPORTED_SAFE_NETWORKS.find(
    (network) => network.name === selectedChain,
  );

  if (!selectedNetwork || !selectedNetwork.safeTxService) {
    throw new Error(`Selected chain ${selectedChain} not currently supported.`);
  }

  return selectedNetwork.safeTxService;
};
