import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionAddParams, transactionPending } from '../../actionCreators';
import {
  putError,
  takeFrom,
  uploadAnnotation,
  getMoveFundsPermissionProofs,
  initiateTransaction,
  createActionMetadataInDB,
} from '../utils';

function* createMoveFundsAction({
  payload: {
    colonyAddress,
    colonyName,
    fromDomain,
    toDomain,
    amount,
    tokenAddress,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_MOVE_FUNDS>) {
  let txChannel;
  try {
    /*
     * Validate the required values for the payment
     */
    if (!fromDomain) {
      throw new Error(
        'Source domain not set for oveFundsBetweenPots transaction',
      );
    }
    if (!toDomain) {
      throw new Error(
        'Recipient domain not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!amount) {
      throw new Error(
        'Payment amount not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!tokenAddress) {
      throw new Error(
        'Payment token not set for MoveFundsBetweenPots transaction',
      );
    }

    const { nativeFundingPotId: fromPot } = fromDomain;
    const { nativeFundingPotId: toPot } = toDomain;

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'moveFunds';

    const { moveFunds, annotateMoveFunds } = yield createTransactionChannels(
      metaId,
      ['moveFunds', 'annotateMoveFunds'],
    );

    yield fork(createTransaction, moveFunds.id, {
      context: ClientType.ColonyClient,
      methodName:
        'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)',
      identifier: colonyAddress,
      params: [],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMoveFunds.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateMoveFunds.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(moveFunds.id));

    const [permissionDomainId, fromChildSkillIndex, toChildSkillIndex] =
      yield getMoveFundsPermissionProofs(colonyAddress, fromPot, toPot);

    yield put(
      transactionAddParams(moveFunds.id, [
        permissionDomainId,
        fromChildSkillIndex,
        toChildSkillIndex,
        fromPot,
        toPot,
        amount,
        tokenAddress,
      ]),
    );

    yield initiateTransaction({ id: moveFunds.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      moveFunds.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMoveFunds,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_MOVE_FUNDS_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    putError(ActionTypes.ACTION_MOVE_FUNDS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* moveFundsActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MOVE_FUNDS, createMoveFundsAction);
}
