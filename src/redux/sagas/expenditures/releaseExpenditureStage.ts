import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action, type AllActions } from '~redux/types/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

function* releaseExpenditureStage({
  payload: {
    colonyAddress,
    expenditure,
    slotId,
    tokenAddresses,
    stagedExpenditureAddress,
    annotationMessage,
  },
  meta,
}: Action<ActionTypes.RELEASE_EXPENDITURE_STAGE>) {
  const batchKey = 'releaseExpenditure';

  const {
    releaseExpenditure,
    annotateReleaseExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['releaseExpenditure', 'annotateReleaseExpenditure'],
  );

  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  try {
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      expenditure.nativeDomainId,
      ColonyRole.Arbitration,
      stagedExpenditureAddress,
    );

    yield fork(createTransaction, releaseExpenditure.id, {
      context: ClientType.StagedExpenditureClient,
      methodName: 'releaseStagedPayment',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: [
        permissionDomainId,
        childSkillIndex,
        expenditure.nativeId,
        slotId,
        tokenAddresses,
      ],
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateReleaseExpenditure.id, {
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

    yield takeFrom(releaseExpenditure.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateReleaseExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: releaseExpenditure.id });
    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      releaseExpenditure.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield waitForTxResult(releaseExpenditure.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateReleaseExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.RELEASE_EXPENDITURE_STAGE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.RELEASE_EXPENDITURE_STAGE_ERROR,
      error,
      meta,
    );
  }
  [releaseExpenditure, annotateReleaseExpenditure].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* releaseExpenditureStageSaga() {
  yield takeEvery(
    ActionTypes.RELEASE_EXPENDITURE_STAGE,
    releaseExpenditureStage,
  );
}
