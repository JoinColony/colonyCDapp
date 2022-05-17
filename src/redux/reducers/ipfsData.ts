import { Map as ImmutableMap } from 'immutable';

import { withFetchableDataMap } from './utils';

import { FetchableData } from '../immutable';
import { ActionTypes } from '../actionTypes';
import { ReducerType } from '../types/reducer';
import { IpfsDataType } from '../state/index';

const ipfsDatasReducer: ReducerType<IpfsDataType> = (
  state = ImmutableMap() as IpfsDataType,
  action,
) => {
  switch (action.type) {
    case ActionTypes.IPFS_DATA_UPLOAD_SUCCESS:
    case ActionTypes.IPFS_DATA_FETCH_SUCCESS: {
      const { ipfsHash, ipfsData } = action.payload;
      return state.getIn([ipfsHash, 'record'])
        ? state
        : state.set(ipfsHash, FetchableData({ record: ipfsData }));
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<IpfsDataType, string>(
  ActionTypes.IPFS_DATA_FETCH,
  ImmutableMap() as IpfsDataType,
)(ipfsDatasReducer);
