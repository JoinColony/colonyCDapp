import { type AnyStreamingPaymentsClient, ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import {
  type ColonyManager,
  ContextModule,
  getContext,
} from '~context/index.ts';
import {
  type UpdateStreamingPaymentMetadataMutation,
  type UpdateStreamingPaymentMetadataMutationVariables,
  UpdateStreamingPaymentMetadataDocument,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/index.ts';
import { getExpenditureDatabaseId } from '~utils/databaseId.ts';
import { toNumber } from '~utils/numbers.ts';

import {
  createTransaction,
  waitForTxResult,
  getTxChannel,
} from '../transactions/index.ts';
import { checkColonyVersionCompliance } from '../utils/checkColonyVersionCompliance.ts';
import { getEditStreamingPaymentMulticallData } from '../utils/editStreamingPaymentMulticall.ts';
import {
  getColonyManager,
  getUpdatedStreamingPaymentMetadataChangelog,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

function* editStreamingPaymentAction({
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
  },
  meta,
}: Action<ActionTypes.STREAMING_PAYMENT_EDIT>) {
  const { colonyAddress } = colony;
  const apolloClient = getContext(ContextModule.ApolloClient);

  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const batchKey = 'editStreamingPayment';

  const txChannel = yield call(getTxChannel, meta.id);

  try {
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

    yield fork(createTransaction, meta.id, {
      context: ClientType.StreamingPaymentsClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: [multicallData],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: meta.id });

    const {
      type,
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      if (streamingPayment.metadata) {
        yield apolloClient.mutate<
          UpdateStreamingPaymentMetadataMutation,
          UpdateStreamingPaymentMetadataMutationVariables
        >({
          mutation: UpdateStreamingPaymentMetadataDocument,
          variables: {
            input: {
              id: getExpenditureDatabaseId(
                colonyAddress,
                toNumber(streamingPayment.nativeId),
              ),
              endCondition,
              changelog: getUpdatedStreamingPaymentMetadataChangelog({
                transactionHash: txHash,
                metadata: streamingPayment.metadata,
                newEndCondition: endCondition,
              }),
            },
          },
        });
      }

      yield put<AllActions>({
        type: ActionTypes.STREAMING_PAYMENT_EDIT_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(
      ActionTypes.STREAMING_PAYMENT_EDIT_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();
  return null;
}

export default function* editStreamingPaymentSaga() {
  yield takeEvery(
    ActionTypes.STREAMING_PAYMENT_EDIT,
    editStreamingPaymentAction,
  );
}
