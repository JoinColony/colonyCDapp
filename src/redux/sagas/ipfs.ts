import { call, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError } from '~utils/saga/effects';

function* ipfsDataUpload({
  meta,
  payload: { ipfsData },
}: Action<ActionTypes.IPFS_DATA_UPLOAD>) {
  try {
    const ipfs = getContext(ContextModule.IPFSWithFallback);

    const ipfsHash = yield call([ipfs, ipfs.addString], ipfsData);

    yield put<AllActions>({
      type: ActionTypes.IPFS_DATA_UPLOAD_SUCCESS,
      meta,
      payload: { ipfsHash, ipfsData },
    });
  } catch (error) {
    return yield putError(ActionTypes.IPFS_DATA_UPLOAD_ERROR, error, meta);
  }
  return null;
}

export default function* ipfsSagas() {
  yield takeEvery(ActionTypes.IPFS_DATA_UPLOAD, ipfsDataUpload);
}
