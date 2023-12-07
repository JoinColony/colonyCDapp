import { nanoid } from 'nanoid';
import { call, put } from 'redux-saga/effects';
import { putError, initiateMessageSigning } from '../utils';
import { ActionTypes } from '../../actionTypes';
import { AllActions } from '../../types/actions';
import { ContextModule, getContext } from '~context';
import { isFullWallet } from '~types';

export function* signMessage(purpose, message) {
  const wallet = getContext(ContextModule.Wallet);

  if (!isFullWallet(wallet)) {
    throw new Error('Background login not yet completed.');
  }

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
