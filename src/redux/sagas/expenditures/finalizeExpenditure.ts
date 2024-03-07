import { ClientType } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  claimExpenditurePayouts,
  getImmediatelyClaimableSlots,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

export type FinalizeExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_FINALIZE>['payload'];

function* finalizeExpenditureAction({
  payload: { colonyAddress, expenditure, annotationMessage },
  meta,
}: Action<ActionTypes.EXPENDITURE_FINALIZE>) {
  const batchKey = 'finalizeExpenditure';

  const {
    finalizeExpenditure,
    annotateFinalizeExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['finalizeExpenditure', 'annotateFinalizeExpenditure'],
  );

  try {
    yield fork(createTransaction, finalizeExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'finalizeExpenditure',
      identifier: colonyAddress,
      params: [expenditure.nativeId],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateFinalizeExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(
      finalizeExpenditure.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        annotateFinalizeExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: finalizeExpenditure.id });
    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      finalizeExpenditure.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield waitForTxResult(finalizeExpenditure.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateFinalizeExpenditure,
        message: annotationMessage,
        txHash,
      });
    }
    const claimableSlots = getImmediatelyClaimableSlots(expenditure.slots);

    yield claimExpenditurePayouts({
      colonyAddress,
      claimableSlots,
      metaId: meta.id,
      nativeExpenditureId: expenditure.nativeId,
    });

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_FINALIZE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_FINALIZE_ERROR, error, meta);
  }
  [finalizeExpenditure, annotateFinalizeExpenditure].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* finalizeExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FINALIZE, finalizeExpenditureAction);
}
