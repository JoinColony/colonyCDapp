import {
  ClientType,
  Id,
  getPermissionProofs,
  ColonyRole,
} from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { type Action, ActionTypes } from '~redux/index.ts';
import {
  createGroupTransaction,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import { checkColonyVersionCompliance } from '~redux/sagas/utils/checkColonyVersionCompliance.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '~redux/sagas/utils/index.ts';

function* cancelStreamingPaymentsMotionAction({
  meta,
  meta: { setTxHash, id: metaId },
  payload: {
    colony,
    votingReputationAddress,
    motionDomainId,
    streamingPayment,
    annotationMessage,
  },
}: Action<ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL>) {
  const { createMotion, annotateMotion } = yield createTransactionChannels(
    meta.id,
    ['createMotion', 'annotateMotion'],
  );

  try {
    if (
      !colony ||
      !votingReputationAddress ||
      !motionDomainId ||
      !streamingPayment
    ) {
      throw new Error('Invalid payload');
    }

    const { colonyAddress } = colony;

    checkColonyVersionCompliance({
      colony,
      actionType: ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL,
    });

    const colonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const streamingPaymentsClient = yield colonyManager.getClient(
      ClientType.StreamingPaymentsClient,
      colonyAddress,
    );

    const { skillId } = yield colonyClient.getDomain(Id.RootDomain);

    const { key, value, branchMask, siblings } =
      yield colonyClient.getReputation(skillId, ADDRESS_ZERO);

    const [adminPermissionDomainId, adminChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        streamingPayment.nativeDomainId,
        ColonyRole.Administration,
        votingReputationAddress,
      );

    const [, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      streamingPayment.nativeDomainId,
      ColonyRole.Arbitration,
      votingReputationAddress,
    );

    const encodedAction = streamingPaymentsClient.interface.encodeFunctionData(
      'cancel',
      [
        adminPermissionDomainId,
        adminChildSkillIndex,
        streamingPayment.nativeId,
      ],
    );

    const batchKey = 'createMotion';

    yield createGroupTransaction({
      channel: createMotion,
      batchKey,
      meta,
      config: {
        context: ClientType.VotingReputationClient,
        methodName: 'createMotion',
        identifier: colonyAddress,
        params: [
          motionDomainId,
          childSkillIndex,
          streamingPaymentsClient.address,
          encodedAction,
          key,
          value,
          branchMask,
          siblings,
        ],
        group: {
          key: batchKey,
          id: meta.id,
          index: 0,
        },
      },
    });

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield fork(createTransaction, annotateMotion.id, {
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

      yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield initiateTransaction(createMotion.id);

    const {
      type,
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMotion.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put({
        type: ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL_SUCCESS,
        meta,
      });
    }
  } catch (e) {
    console.error(e);

    yield putError(ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL_ERROR, e, meta);
  } finally {
    [createMotion, annotateMotion].forEach((channel) =>
      channel.channel.close(),
    );
  }

  return null;
}

export default function* cancelStreamingPaymentsMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL,
    cancelStreamingPaymentsMotionAction,
  );
}
