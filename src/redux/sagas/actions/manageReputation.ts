import { ClientType, getPermissionProofs, ColonyRole } from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import {
  transactionSetParams,
  transactionSetPending,
} from '~state/transactionState.ts';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
  getColonyManager,
  createActionMetadataInDB,
} from '../utils/index.ts';

export type ManageReputationPermissionsPayload =
  Action<ActionTypes.ACTION_MANAGE_REPUTATION>['payload'];

function* manageReputationAction({
  payload: {
    colonyAddress,
    domainId,
    userAddress,
    amount,
    isSmitingReputation,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_MANAGE_REPUTATION>) {
  let txChannel;
  try {
    const colonyManager: ColonyManager = yield getColonyManager();

    const batchKey = isSmitingReputation
      ? 'emitDomainReputationPenalty'
      : 'emitDomainReputationReward';

    if (!userAddress) {
      throw new Error(`User address not set for ${batchKey} transaction`);
    }

    if (!domainId) {
      throw new Error(`Domain id not set for ${batchKey} transaction`);
    }

    if (!colonyAddress) {
      throw new Error(`Colony address not set for ${batchKey} transaction`);
    }

    txChannel = yield call(getTxChannel, metaId);

    const { manageReputation, annotateManageReputation } =
      yield createTransactionChannels(metaId, [
        'manageReputation',
        'annotateManageReputation',
      ]);

    yield createGroupTransaction({
      channel: manageReputation,
      batchKey,
      meta,
      config: {
        context: ClientType.ColonyClient,
        methodName: isSmitingReputation
          ? 'emitDomainReputationPenalty'
          : 'emitDomainReputationReward',
        identifier: colonyAddress,
        params: [],
        ready: false,
      },
    });

    if (annotationMessage) {
      yield createGroupTransaction({
        channel: annotateManageReputation,
        batchKey,
        meta,
        config: {
          context: ClientType.ColonyClient,
          methodName: 'annotateTransaction',
          identifier: colonyAddress,
          params: [],
          ready: false,
        },
      });
    }

    yield takeFrom(manageReputation.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateManageReputation.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield transactionSetPending(manageReputation.id);

    if (isSmitingReputation) {
      const colonyClient = yield colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );

      const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        domainId,
        ColonyRole.Arbitration,
      );

      yield transactionSetParams(manageReputation.id, [
        permissionDomainId,
        childSkillIndex,
        domainId,
        userAddress,
        amount,
      ]);
    } else {
      yield transactionSetParams(manageReputation.id, [
        domainId,
        userAddress,
        amount,
      ]);
    }

    yield initiateTransaction(manageReputation.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(manageReputation.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateManageReputation,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_MANAGE_REPUTATION_SUCCESS,
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.ACTION_MANAGE_REPUTATION_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* manageReputationActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MANAGE_REPUTATION, manageReputationAction);
}
