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
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

function* cancelDraftExpenditure({
  meta,
  payload: {
    colonyAddress,
    expenditure,
    stakedExpenditureAddress,
    annotationMessage,
  },
}: Action<ActionTypes.EXPENDITURE_DRAFT_CANCEL>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const batchKey = 'cancelDraftExpenditure';
  const {
    cancelExpenditure,
    cancelAndReclaimStake,
    annotateCancelExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['cancelExpenditure', 'cancelAndReclaimStake', 'annotateCancelExpenditure'],
  );

  try {
    if (expenditure.isStaked && stakedExpenditureAddress) {
      const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        expenditure.nativeDomainId,
        ColonyRole.Arbitration,
        stakedExpenditureAddress,
      );

      yield fork(createTransaction, cancelAndReclaimStake.id, {
        context: ClientType.StakedExpenditureClient,
        methodName: 'cancelAndReclaimStake',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 0,
        },
        params: [permissionDomainId, childSkillIndex, expenditure.nativeId],
      });

      if (annotationMessage) {
        yield fork(createTransaction, annotateCancelExpenditure.id, {
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
        cancelAndReclaimStake.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
      if (annotationMessage) {
        yield takeFrom(
          annotateCancelExpenditure.channel,
          ActionTypes.TRANSACTION_CREATED,
        );
      }

      const {
        payload: { hash: txHash },
      } = yield takeFrom(
        cancelAndReclaimStake.channel,
        ActionTypes.TRANSACTION_HASH_RECEIVED,
      );
      yield initiateTransaction({ id: cancelAndReclaimStake.id });

      yield waitForTxResult(cancelAndReclaimStake.channel);

      if (annotationMessage) {
        yield uploadAnnotation({
          txChannel: annotateCancelExpenditure,
          message: annotationMessage,
          txHash,
        });
      }
    } else {
      yield fork(createTransaction, cancelExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'cancelExpenditure',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 0,
        },
        params: [expenditure.nativeId],
      });
      if (annotationMessage) {
        yield fork(createTransaction, annotateCancelExpenditure.id, {
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
        cancelExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
      if (annotationMessage) {
        yield takeFrom(
          annotateCancelExpenditure.channel,
          ActionTypes.TRANSACTION_CREATED,
        );
      }

      const {
        payload: { hash: txHash },
      } = yield takeFrom(
        cancelExpenditure.channel,
        ActionTypes.TRANSACTION_HASH_RECEIVED,
      );
      yield initiateTransaction({ id: cancelExpenditure.id });

      yield waitForTxResult(cancelExpenditure.channel);

      if (annotationMessage) {
        yield uploadAnnotation({
          txChannel: annotateCancelExpenditure,
          message: annotationMessage,
          txHash,
        });
      }
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_DRAFT_CANCEL_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.EXPENDITURE_DRAFT_CANCEL_ERROR,
      error,
      meta,
    );
  }
  [cancelExpenditure, cancelAndReclaimStake, annotateCancelExpenditure].forEach(
    (channel) => channel.channel.close(),
  );

  return null;
}

export default function* cancelDraftExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_DRAFT_CANCEL, cancelDraftExpenditure);
}
