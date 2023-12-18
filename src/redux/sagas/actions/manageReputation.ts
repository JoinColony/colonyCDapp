import { ClientType, getPermissionProofs, ColonyRole } from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ColonyManager } from '~context';
import { Action, ActionTypes, AllActions } from '~redux';
import {
  transactionAddParams,
  transactionPending,
} from '~redux/actionCreators';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import {
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
  getColonyManager,
  createActionMetadataInDB,
} from '../utils';

function* manageReputationAction({
  payload: {
    colonyAddress,
    colonyName,
    domainId,
    userAddress,
    amount,
    isSmitingReputation,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
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

    yield createGroupTransaction(manageReputation, batchKey, meta, {
      context: ClientType.ColonyClient,
      methodName: isSmitingReputation
        ? 'emitDomainReputationPenalty'
        : 'emitDomainReputationReward',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateManageReputation, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(manageReputation.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateManageReputation.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(manageReputation.id));

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

      yield put(
        transactionAddParams(manageReputation.id, [
          permissionDomainId,
          childSkillIndex,
          domainId,
          userAddress,
          amount,
        ]),
      );
    } else {
      yield put(
        transactionAddParams(manageReputation.id, [
          domainId,
          userAddress,
          amount,
        ]),
      );
    }

    yield initiateTransaction({ id: manageReputation.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      manageReputation.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(manageReputation.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateManageReputation,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_MANAGE_REPUTATION_SUCCESS,
      meta,
    });

    setTxHash?.(txHash);

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_MANAGE_REPUTATION_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* manageReputationActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MANAGE_REPUTATION, manageReputationAction);
}
