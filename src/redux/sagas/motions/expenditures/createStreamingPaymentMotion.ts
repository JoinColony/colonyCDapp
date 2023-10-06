import { call, put, takeEvery } from 'redux-saga/effects';
import {
  AnyStreamingPaymentsClient,
  ClientType,
  ColonyRole,
  Id,
  getPermissionProofs,
} from '@colony/colony-js';

import { Action, ActionTypes } from '~redux';
import {
  getColonyManager,
  initiateTransaction,
  takeFrom,
} from '~redux/sagas/utils';
import {
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions';
import { ADDRESS_ZERO } from '~constants';
import { ContextModule, getContext } from '~context';
import {
  CreateStreamingPaymentMetadataDocument,
  CreateStreamingPaymentMetadataMutation,
  CreateStreamingPaymentMetadataMutationVariables,
} from '~gql';
import { getPendingMetadataDatabaseId } from '~utils/databaseId';

// @TODO: Figure out a more appropriate way of getting this
const TIMESTAMP_IN_FUTURE = 2_000_000_000;

function* createStreamingPaymentMotion({
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
  },
  meta,
  meta: { setTxHash },
}: Action<ActionTypes.MOTION_STREAMING_PAYMENT_CREATE>) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  const batchId = 'motion-streaming-payment-create';
  const { createMotion /* annotationMessage */ } = yield call(
    createTransactionChannels,
    meta.id,
    ['createMotion', 'annotateMotion'],
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
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient,
      createdInDomain.nativeId,
      ColonyRole.Arbitration,
    );

    const encodedCreateStreamingPaymentAction =
      yield streamingPaymentsClient.interface.encodeFunctionData('create', [
        permissionDomainId,
        childSkillIndex,
        permissionDomainId,
        childSkillIndex,
        createdInDomain.nativeId,
        startTime,
        endTime ?? TIMESTAMP_IN_FUTURE,
        interval,
        recipientAddress,
        [tokenAddress],
        [amount],
      ]);

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      Id.RootDomain,
    );

    const { key, value, branchMask, siblings } = yield call(
      [colonyClient, colonyClient.getReputation],
      skillId,
      ADDRESS_ZERO,
    );

    yield createGroupTransaction(createMotion, batchId, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        createdInDomain.nativeId,
        childSkillIndex,
        streamingPaymentsClient.address,
        encodedCreateStreamingPaymentAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        title: { id: 'transaction.group.createMotion.title' },
        description: {
          id: 'transaction.group.createMotion.description',
        },
      },
    });

    yield initiateTransaction({ id: createMotion.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    const { type } = yield call(waitForTxResult, createMotion.channel);

    yield apolloClient.mutate<
      CreateStreamingPaymentMetadataMutation,
      CreateStreamingPaymentMetadataMutationVariables
    >({
      mutation: CreateStreamingPaymentMetadataDocument,
      variables: {
        input: {
          id: getPendingMetadataDatabaseId(colonyAddress, txHash),
          endCondition,
          limitAmount,
        },
      },
    });

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<Action<ActionTypes.MOTION_STREAMING_PAYMENT_CREATE_SUCCESS>>({
        type: ActionTypes.MOTION_STREAMING_PAYMENT_CREATE_SUCCESS,
        meta,
      });

      window.history.replaceState(
        {},
        '',
        `${window.location.origin}${window.location.pathname}?tx=${txHash}`,
      );
    }
  } catch (e) {
    console.error(e);
    yield put<Action<ActionTypes.MOTION_STREAMING_PAYMENT_CREATE_ERROR>>({
      type: ActionTypes.MOTION_STREAMING_PAYMENT_CREATE_ERROR,
      payload: {
        name: ActionTypes.MOTION_STREAMING_PAYMENT_CREATE_ERROR,
        message: JSON.stringify(e),
      },
      meta,
      error: true,
    });
  } finally {
    createMotion.channel.close();
  }
}

export default function* cancelStakedExpenditureMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_STREAMING_PAYMENT_CREATE,
    createStreamingPaymentMotion,
  );
}
