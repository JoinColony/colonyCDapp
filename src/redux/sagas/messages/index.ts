import { nanoid } from 'nanoid';
import { call, put, race, take } from 'redux-saga/effects';

import { putError } from '../utils';
import { ActionTypes } from '../../actionTypes';
import { AllActions } from '../../types/actions';
import { ContextModule, TEMP_getContext } from '~context/index';

export function* signMessage(purpose, message) {
  const wallet = TEMP_getContext(ContextModule.Wallet);

  if (!wallet) throw new Error('Could not get wallet');

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

  /*
   * @NOTE Wait (block) until there's a matching action
   * for sign or cancel and get its generated id for the async listener
   */
  const [signAction, cancelAction] = yield race([
    take(
      (action: AllActions) =>
        action.type === ActionTypes.MESSAGE_SIGN &&
        action.payload.id === messageId,
    ),
    take(
      (action: AllActions) =>
        action.type === ActionTypes.MESSAGE_CANCEL &&
        action.payload.id === messageId,
    ),
  ]);

  if (cancelAction) throw new Error('User cancelled signing of message');

  const {
    meta: { id },
  } = signAction;

  try {
    const signature = yield call([wallet, wallet.signMessage], {
      message: messageString,
    });

    yield put<AllActions>({
      type: ActionTypes.MESSAGE_SIGNED,
      payload: { id: messageId, signature },
      meta: { id },
    });
    return signature;
  } catch (caughtError) {
    yield putError(ActionTypes.MESSAGE_ERROR, caughtError, {
      messageId,
      id,
    });
    throw caughtError;
  }
}
