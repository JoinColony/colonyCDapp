import {
  type AnyStreamingPaymentsClient,
  ClientType,
  ColonyRole,
  getPermissionProofs,
} from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateStreamingPaymentMetadataDocument,
  type CreateStreamingPaymentMetadataMutation,
  type CreateStreamingPaymentMetadataMutationVariables,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/index.ts';
import { BatchKeys } from '~types/transactions.ts';
import { getExpenditureDatabaseId } from '~utils/databaseId.ts';
import { toNumber } from '~utils/numbers.ts';

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

export type CreateStreamingPaymentPayload =
  Action<ActionTypes.STREAMING_PAYMENT_CREATE>['payload'];

// @TODO: Figure out a more appropriate way of getting this
const TIMESTAMP_IN_FUTURE = 2_000_000_000;

function* createStreamingPaymentAction({
  payload: {
    colonyAddress,
    createdInDomain,
    recipientAddress,
    tokenAddress,
    amount,
    startTime,
    endTime,
    interval,
    endCondition,
    limitAmount,
    annotationMessage,
  },
  meta,
}: Action<ActionTypes.STREAMING_PAYMENT_CREATE>) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  const batchKey = BatchKeys.CreateStreamingPayment;

  const {
    createStreamingPayment,
    annotateCreateStreamingPayment,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['createStreamingPayment', 'annotateCreateStreamingPayment'],
  );

  try {
    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const streamingPaymentsClient: AnyStreamingPaymentsClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.StreamingPaymentsClient,
      colonyAddress,
    );

    // Get permissions proof of the caller's Funding permission
    const [fundingPermissionDomainId, fundingChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        createdInDomain.nativeId,
        ColonyRole.Arbitration,
      );

    // Get permissions proof of the caller's Admin permission
    const [adminPermissionDomainId, adminChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        createdInDomain.nativeId,
        ColonyRole.Arbitration,
      );

    yield fork(createTransaction, createStreamingPayment.id, {
      context: ClientType.StreamingPaymentsClient,
      methodName: 'create',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: [
        fundingPermissionDomainId,
        fundingChildSkillIndex,
        adminPermissionDomainId,
        adminChildSkillIndex,
        createdInDomain.nativeId,
        startTime,
        endTime ?? TIMESTAMP_IN_FUTURE,
        interval,
        recipientAddress,
        [tokenAddress],
        [amount],
      ],
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateCreateStreamingPayment.id, {
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
      createStreamingPayment.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        annotateCreateStreamingPayment.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: createStreamingPayment.id });
    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createStreamingPayment.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield waitForTxResult(createStreamingPayment.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateCreateStreamingPayment,
        message: annotationMessage,
        txHash,
      });
    }

    const streamingPaymentId = yield call(
      streamingPaymentsClient.getNumStreamingPayments,
    );

    yield apolloClient.mutate<
      CreateStreamingPaymentMetadataMutation,
      CreateStreamingPaymentMetadataMutationVariables
    >({
      mutation: CreateStreamingPaymentMetadataDocument,
      variables: {
        input: {
          id: getExpenditureDatabaseId(
            colonyAddress,
            toNumber(streamingPaymentId),
          ),
          endCondition,
          limitAmount,
        },
      },
    });

    yield put<AllActions>({
      type: ActionTypes.STREAMING_PAYMENT_CREATE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.STREAMING_PAYMENT_CREATE_ERROR,
      error,
      meta,
    );
  }
  [createStreamingPayment, annotateCreateStreamingPayment].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* createStreamingPaymentSaga() {
  yield takeEvery(
    ActionTypes.STREAMING_PAYMENT_CREATE,
    createStreamingPaymentAction,
  );
}
