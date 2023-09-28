import { call, fork, takeEvery } from 'redux-saga/effects';
import {
  AnyStreamingPaymentsClient,
  ClientType,
  ColonyRole,
  getPermissionProofs,
} from '@colony/colony-js';

import { ActionTypes } from '~redux/actionTypes';
import { Action } from '~redux/types';
import { ContextModule, getContext } from '~context';
import {
  CreateStreamingPaymentMetadataDocument,
  CreateStreamingPaymentMetadataMutation,
  CreateStreamingPaymentMetadataMutationVariables,
} from '~gql';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import { toNumber } from '~utils/numbers';

import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils';
import { createTransaction, getTxChannel } from '../transactions';

export type CreateStreamingPaymentPayload =
  Action<ActionTypes.STREAMING_PAYMENT_CREATE>['payload'];

// @TODO: Figure out a more appropriate way of getting this
const TIMESTAMP_IN_FUTURE = 2_000_000_000;

function* createStreamingPayment({
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
}: Action<ActionTypes.STREAMING_PAYMENT_CREATE>) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  const txChannel = yield getTxChannel(meta.id);

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
        colonyClient,
        createdInDomain.nativeId,
        ColonyRole.Arbitration,
      );

    // Get permissions proof of the caller's Admin permission
    const [adminPermissionDomainId, adminChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient,
        createdInDomain.nativeId,
        ColonyRole.Arbitration,
      );

    yield fork(createTransaction, meta.id, {
      context: ClientType.StreamingPaymentsClient,
      methodName: 'create',
      identifier: colonyAddress,
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

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);
    yield initiateTransaction({ id: meta.id });
    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

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
  } catch (error) {
    return yield putError(
      ActionTypes.STREAMING_PAYMENT_CREATE_ERROR,
      error,
      meta,
    );
  }
  return null;
}

export default function* createStreamingPaymentSaga() {
  yield takeEvery(ActionTypes.STREAMING_PAYMENT_CREATE, createStreamingPayment);
}
