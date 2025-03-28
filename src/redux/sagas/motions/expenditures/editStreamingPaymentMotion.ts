import {
  type AnyStreamingPaymentsClient,
  ClientType,
  ColonyRole,
  getPermissionProofs,
  Id,
} from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO, APP_URL } from '~constants';
import {
  type ColonyManager,
  ContextModule,
  getContext,
} from '~context/index.ts';
import {
  type CreateStreamingPaymentMetadataMutation,
  type CreateStreamingPaymentMetadataMutationVariables,
  CreateStreamingPaymentMetadataDocument,
} from '~gql';
import { type Action, ActionTypes } from '~redux/index.ts';
import {
  createGroupTransaction,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import { checkColonyVersionCompliance } from '~redux/sagas/utils/checkColonyVersionCompliance.ts';
import { getEditStreamingPaymentMulticallData } from '~redux/sagas/utils/editStreamingPaymentMulticall.ts';
import {
  getColonyManager,
  getUpdatedStreamingPaymentMetadataChangelog,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '~redux/sagas/utils/index.ts';
import { getPendingMetadataDatabaseId } from '~utils/databaseId.ts';

function* editStreamingPaymentMotion({
  payload: {
    colony,
    streamingPayment,
    streamingPaymentsAddress,
    startTimestamp,
    endTimestamp,
    amount,
    interval,
    endCondition,
    limitAmount,
    votingReputationAddress,
    motionDomainId,
    annotationMessage,
  },
  meta,
  meta: { setTxHash, id: metaId },
}: Action<ActionTypes.MOTION_STREAMING_PAYMENT_EDIT>) {
  const { colonyAddress } = colony;
  const apolloClient = getContext(ContextModule.ApolloClient);

  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const batchKey = 'editStreamingPaymentMotion';

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

    checkColonyVersionCompliance({
      colony,
    });

    const streamingPaymentsClient: AnyStreamingPaymentsClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.StreamingPaymentsClient,
      colonyAddress,
    );

    if (!streamingPaymentsClient) {
      throw new Error('Streaming payments extension cannot be found');
    }

    const multicallData = yield getEditStreamingPaymentMulticallData({
      streamingPayment,
      colonyClient,
      streamingPaymentsAddress,
      colony,
      streamingPaymentsClient,
      amount,
      interval,
      startTimestamp,
      endTimestamp,
      limitAmount,
      endCondition,
    });

    const [, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      streamingPayment.nativeDomainId,
      [ColonyRole.Funding, ColonyRole.Administration],
      votingReputationAddress,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      Id.RootDomain,
    );

    const { key, value, branchMask, siblings } = yield call(
      [colonyClient, colonyClient.getReputation],
      skillId,
      ADDRESS_ZERO,
    );

    const encodedEditStreamingPaymentAction =
      yield colonyClient.interface.encodeFunctionData(
        'multicall(bytes[] calldata)',
        [multicallData],
      );

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
          streamingPaymentsAddress,
          encodedEditStreamingPaymentAction,
          key,
          value,
          branchMask,
          siblings,
        ],
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

    if (streamingPayment.metadata) {
      yield apolloClient.mutate<
        CreateStreamingPaymentMetadataMutation,
        CreateStreamingPaymentMetadataMutationVariables
      >({
        mutation: CreateStreamingPaymentMetadataDocument,
        variables: {
          input: {
            id: getPendingMetadataDatabaseId(colonyAddress, txHash),
            endCondition:
              endCondition ?? streamingPayment.metadata.endCondition,
            changelog: getUpdatedStreamingPaymentMetadataChangelog({
              transactionHash: txHash,
              metadata: streamingPayment.metadata,
              newEndCondition: endCondition,
            }),
          },
        },
      });
    }

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
        type: ActionTypes.MOTION_STREAMING_PAYMENT_EDIT_SUCCESS,
        meta,
      });

      // @TODO: Remove during advanced payments UI wiring
      // eslint-disable-next-line no-console
      console.log(
        `Edit Streaming Payment Motion URL: ${APP_URL}${window.location.pathname.slice(
          1,
        )}?tx=${txHash}`,
      );
    }

    window.history.replaceState(
      {},
      '',
      `${APP_URL}${window.location.pathname.slice(1)}?tx=${txHash}`,
    );
  } catch (e) {
    console.error(e);

    yield putError(ActionTypes.MOTION_STREAMING_PAYMENT_EDIT_ERROR, e, meta);
  } finally {
    [createMotion, annotateMotion].forEach((channel) =>
      channel.channel.close(),
    );
  }

  return null;
}

export default function* editStreamingPaymentMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_STREAMING_PAYMENT_EDIT,
    editStreamingPaymentMotion,
  );
}
