import { ActionTypes } from '~redux/actionTypes.ts';
import { AllActions } from '~redux/types/index.ts';

export const uploadIpfsData = (ipfsData: string, id: string): AllActions => ({
  type: ActionTypes.IPFS_DATA_UPLOAD,
  meta: { id },
  payload: { ipfsData },
});
