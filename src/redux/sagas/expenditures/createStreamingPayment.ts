import {
  type AnyStreamingPaymentsClient,
  ClientType,
  ColonyRole,
  getPermissionProofs,
} from '@colony/colony-js';
import moveDecimal from 'move-decimal-point';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateStreamingPaymentMetadataDocument,
  type CreateStreamingPaymentMetadataMutation,
  type CreateStreamingPaymentMetadataMutationVariables,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/index.ts';
import { getExpenditureDatabaseId } from '~utils/databaseId.ts';
import { toNumber } from '~utils/numbers.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  adjustRecipientAddress,
  createActionMetadataInDB,
  getColonyManager,
  getEndTimeByEndCondition,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

export type CreateStreamingPaymentPayload =
  Action<ActionTypes.STREAMING_PAYMENT_CREATE>['payload'];

function* createStreamingPaymentAction({
  payload: {
    colonyAddress,
    createdInDomain,
    recipientAddress,
    tokenAddress,
    tokenDecimals,
    amount,
    startTimestamp,
    endTimestamp,
    interval,
    endCondition,
    limitAmount,
    annotationMessage,
    customActionTitle,
  },
  meta,
  meta: { setTxHash },
}: Action<ActionTypes.STREAMING_PAYMENT_CREATE>) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  const batchKey = 'createStreamingPayment';

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
    const { network } = colonyManager.networkClient;

    const adjustedRecipientAddress = yield adjustRecipientAddress(
      {
        tokenAddress,
        recipientAddress,
      },
      network,
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

    const amountInWei = moveDecimal(amount, tokenDecimals) as string;
    const limitInWei = moveDecimal(limitAmount, tokenDecimals) as string;

    const realEndTimestamp = getEndTimeByEndCondition({
      endCondition,
      startTimestamp,
      interval,
      amountInWei,
      limitInWei,
      endTimestamp,
    });

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
        startTimestamp,
        realEndTimestamp,
        interval,
        adjustedRecipientAddress,
        tokenAddress,
        amountInWei,
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

    yield initiateTransaction(createStreamingPayment.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createStreamingPayment.channel);

    if (customActionTitle) {
      yield createActionMetadataInDB(txHash, customActionTitle);
    }

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
        },
      },
    });

    yield put<AllActions>({
      type: ActionTypes.STREAMING_PAYMENT_CREATE_SUCCESS,
      payload: {},
      meta,
    });

    setTxHash?.(txHash);
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
