import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { getStreamingPaymentCreatingActionId } from '~utils/streamingPayments.ts';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
} from '../utils/index.ts';

export type ClaimStreamingPaymentPayload =
  Action<ActionTypes.STREAMING_PAYMENT_CLAIM>['payload'];

function* claimStreamingPayment({
  payload: {
    colonyAddress,
    streamingPaymentsAddress,
    streamingPayment,
    tokenAddress,
  },
  meta,
}: Action<ActionTypes.STREAMING_PAYMENT_CLAIM>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [extensionPermissionDomainId, extensionChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        streamingPayment.nativeDomainId,
        [ColonyRole.Funding, ColonyRole.Administration],
        streamingPaymentsAddress,
      );

    yield fork(createTransaction, meta.id, {
      context: ClientType.StreamingPaymentsClient,
      methodName: 'claim',
      identifier: colonyAddress,
      params: [
        extensionPermissionDomainId,
        extensionChildSkillIndex,
        extensionChildSkillIndex,
        extensionChildSkillIndex,
        streamingPayment.nativeId,
        [tokenAddress],
      ],
      group: {
        key: 'claimStreamingPayment',
        id: meta.id,
        index: 0,
      },
      associatedActionId: getStreamingPaymentCreatingActionId(streamingPayment),
    });

    yield initiateTransaction(meta.id);

    yield waitForTxResult(txChannel);

    yield put<AllActions>({
      type: ActionTypes.STREAMING_PAYMENT_CLAIM_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.STREAMING_PAYMENT_CLAIM_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();

  return null;
}

export default function* claimStreamingPaymentSaga() {
  yield takeEvery(ActionTypes.STREAMING_PAYMENT_CLAIM, claimStreamingPayment);
}
