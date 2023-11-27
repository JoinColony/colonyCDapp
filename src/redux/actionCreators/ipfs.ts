import { ActionTypes } from '~redux/actionTypes';
import { AllActions } from '~redux/types';

export const uploadIpfsData = (ipfsData: string, id: string): AllActions => ({
  type: ActionTypes.IPFS_DATA_UPLOAD,
  meta: { id },
  payload: { ipfsData },
});
