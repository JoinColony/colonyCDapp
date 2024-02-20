import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  createActionMetadataInDB,
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

function* cancelStakedExpenditureAction({
  meta,
  payload: {
    colonyAddress,
    stakedExpenditureAddress,
    shouldPunish,
    expenditure,
    annotationMessage,
    customActionTitle,
  },
}: Action<ActionTypes.STAKED_EXPENDITURE_CANCEL>) {
  const batchKey = 'cancelStakedExpenditure';

  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const {
    cancelStakedExpenditure,
    annotateCancelStakedExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['cancelStakedExpenditure', 'annotateCancelStakedExpenditure'],
  );

  try {
    const [extensionPermissionDomainId, extensionChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        expenditure.nativeDomainId,
        ColonyRole.Arbitration,
        stakedExpenditureAddress,
      );

    const [userPermissionDomainId, userChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        expenditure.nativeDomainId,
        ColonyRole.Arbitration,
      );

    yield fork(createTransaction, cancelStakedExpenditure.id, {
      context: ClientType.StakedExpenditureClient,
      methodName: 'cancelAndPunish',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: [
        extensionPermissionDomainId,
        extensionChildSkillIndex,
        userPermissionDomainId,
        userChildSkillIndex,
        expenditure.nativeId,
        shouldPunish,
      ],
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateCancelStakedExpenditure.id, {
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
      cancelStakedExpenditure.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        annotateCancelStakedExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      cancelStakedExpenditure.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield initiateTransaction({ id: cancelStakedExpenditure.id });

    yield waitForTxResult(cancelStakedExpenditure.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateCancelStakedExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    if (customActionTitle) {
      yield createActionMetadataInDB(txHash, customActionTitle);
    }

    yield put<AllActions>({
      type: ActionTypes.STAKED_EXPENDITURE_CANCEL_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.STAKED_EXPENDITURE_CANCEL_ERROR,
      error,
      meta,
    );
  }

  return null;
}

export default function* cancelStakedExpenditureSaga() {
  yield takeEvery(
    ActionTypes.STAKED_EXPENDITURE_CANCEL,
    cancelStakedExpenditureAction,
  );
}
