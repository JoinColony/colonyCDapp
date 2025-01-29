import { ClientType } from '@colony/colony-js';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  type TransactionChannelMap,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/index.ts';

export { default as colonyCreateSaga } from './colonyCreate.ts';
export { default as colonyFinishCreate } from './colonyFinishCreate.ts';

// @TODO this might need to be removed in favour of colonyClaimFunds saga, though it implies some refactoring
function* colonyClaimToken({
  payload: { colonyAddress, tokenAddresses },
  meta,
}: Action<ActionTypes.CLAIM_TOKEN>) {
  let txChannels: TransactionChannelMap = {};

  const batchKey = TRANSACTION_METHODS.ClaimColonyFunds;

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

      yield initiateTransaction(id);

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
