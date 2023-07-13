import { Colony } from '~types';

export const getManageSafeDialogPayload = (colony: Colony, payload: any) => {
  const { safe } = payload;

  return {
    colony,
    safeList: [
      {
        chainId: safe.chainId,
        name: safe.name,
        address: safe.walletAddress,
        moduleContractAddress: safe.id,
      },
    ],
  };
};
