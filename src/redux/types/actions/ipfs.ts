import { ActionTypes } from '../../index.ts';

import { ErrorActionType, UniqueActionType } from './index.ts';

export type IpfsActionTypes =
  | UniqueActionType<
      ActionTypes.IPFS_DATA_UPLOAD,
      {
        ipfsData: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.IPFS_DATA_UPLOAD_ERROR, object>
  | UniqueActionType<
      ActionTypes.IPFS_DATA_UPLOAD_SUCCESS,
      {
        ipfsHash: string;
        ipfsData: string;
      },
      object
    >;
