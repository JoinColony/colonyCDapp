import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { initiateTransaction, putError, takeFrom } from '../utils';

import {
  TransactionChannelMap,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions';

export { default as colonyCreateSaga } from './colonyCreate';

function* colonyClaimToken({
  payload: { colonyAddress, tokenAddresses },
  meta,
}: Action<ActionTypes.CLAIM_TOKEN>) {
  let txChannels: TransactionChannelMap = {};
  const batchKey = 'claimColonyFunds';
  const uniqueTokenAddresses = [...new Set(tokenAddresses)];
  try {
    txChannels = yield call(
      createTransactionChannels,
      meta.id,
      uniqueTokenAddresses,
    );

    yield all(
      uniqueTokenAddresses.map((tokenAddress, index) =>
        fork(createTransaction, txChannels[tokenAddress].id, {
          context: ClientType.ColonyClient,
          methodName: 'claimColonyFunds',
          identifier: colonyAddress,
          params: [tokenAddress],
          group: {
            key: batchKey,
            id: meta.id,
            index,
          },
        }),
      ),
    );

    for (const tokenAddress of uniqueTokenAddresses) {
      const { channel: txChannel, id } = txChannels[tokenAddress];

      yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

      yield initiateTransaction({ id });

      yield waitForTxResult(txChannel);
    }

    yield put<AllActions>({
      type: ActionTypes.CLAIM_TOKEN_SUCCESS,
      payload: { params: { tokenAddresses: uniqueTokenAddresses } },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.CLAIM_TOKEN_ERROR, error, meta);
  } finally {
    for (const { channel: txChannel } of Object.values(txChannels)) {
      txChannel.close();
    }
  }
  return null;
}

export default function* colonySagas() {
  yield takeEvery(ActionTypes.CLAIM_TOKEN, colonyClaimToken);
}
