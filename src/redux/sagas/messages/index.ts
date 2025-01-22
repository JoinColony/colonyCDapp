import { nanoid } from 'nanoid';
import { call, put } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions } from '~redux/types/actions/index.ts';

import { putError, initiateMessageSigning } from '../utils/index.ts';

export function* signMessage(purpose, message) {
  const wallet = getContext(ContextModule.Wallet);

  const messageId = `${nanoid(10)}-signMessage`;
  /*
   * @NOTE Initiate the message signing process
   */
  const messageString = JSON.stringify(message);
  yield put<AllActions>({
    type: ActionTypes.MESSAGE_CREATED,
    payload: {
      id: messageId,
      purpose,
      message: messageString,
      createdAt: new Date(),
    },
  });

  yield initiateMessageSigning(messageId);

  const signer = wallet.ethersProvider.getSigner();

  try {
    const signature = yield call([signer, signer.signMessage], messageString);

    yield put<AllActions>({
      type: ActionTypes.MESSAGE_SIGNED,
      payload: { id: messageId, signature },
      meta: { id: messageId },
    });
    return signature;
  } catch (caughtError) {
    yield putError(ActionTypes.MESSAGE_ERROR, caughtError, {
      messageId,
      id: messageId,
    });
    throw caughtError;
  }
}
