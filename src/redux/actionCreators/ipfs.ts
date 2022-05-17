import { ActionTypes } from '../actionTypes';
import { AllActions } from '../types/actions';

export const uploadIpfsData = (ipfsData: string, id: string): AllActions => ({
  type: ActionTypes.IPFS_DATA_UPLOAD,
  meta: { id },
  payload: { ipfsData },
});

export const fetchIpfsData = (ipfsHash: string): AllActions => ({
  type: ActionTypes.IPFS_DATA_FETCH,
  meta: { key: ipfsHash },
  payload: { ipfsHash },
});
