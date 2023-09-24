import { fork, takeEvery } from 'redux-saga/effects';
import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';

import { ActionTypes } from '~redux/actionTypes';
import { Action } from '~redux/types';

import { getColonyManager, putError } from '../utils';
import { createTransaction } from '../transactions';

export type CreateStreamingPaymentPayload =
  Action<ActionTypes.STREAMING_PAYMENT_CREATE>['payload'];

// @TODO: Figure out a more appropriate way of getting this
const TIMESTAMP_IN_FUTURE = 2_000_000_000;

function* createStreamingPayment({
  payload: {
    colonyAddress,
    createdInDomain,
    recipientAddress,
    tokenAddresses,
    amounts,
    startTime,
    endTime,
    interval,
  },
  meta,
}: Action<ActionTypes.STREAMING_PAYMENT_CREATE>) {
  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  try {
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
        tokenAddresses,
        amounts,
      ],
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
