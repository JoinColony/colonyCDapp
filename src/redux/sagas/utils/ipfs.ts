import { getStringForMetadataAnnotation } from '@colony/colony-event-metadata-parser';
import { nanoid } from 'nanoid';
import { call, put } from 'redux-saga/effects';

import { uploadIpfsData } from '~redux/actionCreators/ipfs';
import { filterUniqueAction } from '~utils/actions';
import { ActionTypes } from '~redux/actionTypes';

import { raceError } from './effects';

export function* ipfsUpload(data: string) {
  const id = nanoid();
  yield put(uploadIpfsData(data, id));

  const [
    {
      payload: { ipfsHash },
    },
    error,
  ] = yield raceError(
    filterUniqueAction(id, ActionTypes.IPFS_DATA_UPLOAD_SUCCESS),
    filterUniqueAction(id, ActionTypes.IPFS_DATA_UPLOAD_ERROR),
  );

  if (error) {
    throw new Error(error);
  }

  return ipfsHash;
}

export function* ipfsUploadWithFallback(payload: string) {
  let ipfsHash = '';
  try {
    ipfsHash = yield call(ipfsUpload, payload);
  } catch (error) {
    console.error('Could not upload the colony metadata to IPFS. Retrying...');
  }

  /* If the ipfs upload failed we try again, then if it fails again we just assign
      an empty string so that the `transactionAddParams` won't fail */
  if (!ipfsHash) {
    try {
      ipfsHash = yield call(ipfsUpload, payload);
    } catch (e) {
      console.error(
        'Could not upload the colony metadata to IPFS a second time. Not retrying.',
        e,
      );
    }
  }

  return ipfsHash;
}

export function* ipfsUploadAnnotation(annotationMessage: string) {
  const annotationMetadata = getStringForMetadataAnnotation({
    annotationMsg: annotationMessage,
  });

  return yield call(ipfsUploadWithFallback, annotationMetadata);
}
