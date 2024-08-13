import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ClientType } from '~gql';
import { ActionTypes, type AllActions, type Action } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/index.ts';

function* claimMintTokens({
  meta,
  meta: { id: metaId },
  payload: { colonyAddress, nativeTokenAddress },
}: Action<ActionTypes.MOTION_CLAIM_MINT_TOKENS>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);

    const batchKey = TRANSACTION_METHODS.ClaimColonyFunds;

    const { claimColonyFunds } = yield createTransactionChannels(metaId, [
      TRANSACTION_METHODS.ClaimColonyFunds,
    ]);

    yield fork(createTransaction, claimColonyFunds.id, {
      context: ClientType.ColonyClient,
      methodName: TRANSACTION_METHODS.ClaimColonyFunds,
      identifier: colonyAddress,
      params: [nativeTokenAddress],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    yield takeFrom(claimColonyFunds.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(claimColonyFunds.id);

    yield waitForTxResult(claimColonyFunds.channel);

    yield put<AllActions>({
      type: ActionTypes.MOTION_CLAIM_MINT_TOKENS_SUCCESS,
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.MOTION_CLAIM_MINT_TOKENS_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* claimMintTokensMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_CLAIM_MINT_TOKENS, claimMintTokens);
}
