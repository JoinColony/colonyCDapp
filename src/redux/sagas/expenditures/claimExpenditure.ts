import { ClientType } from '@colony/colony-js';
import { takeEvery, fork, put, all } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { type ExpenditurePayout } from '~types/graphql.ts';

import {
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

export type ClaimExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_CLAIM>['payload'];

type PayoutWithSlotId = ExpenditurePayout & {
  slotId: number;
};

const getPayoutChannelId = (payout: PayoutWithSlotId) =>
  `${payout.slotId}-${payout.tokenAddress}`;

function* claimExpenditure({
  meta,
  payload: {
    colonyAddress,
    nativeExpenditureId,
    claimableSlots,
    annotationMessage,
  },
}: Action<ActionTypes.EXPENDITURE_CLAIM>) {
  const batchKey = 'claimExpenditure';

  const payoutsWithSlotIds = claimableSlots.flatMap(
    (slot) =>
      slot.payouts
        ?.filter((payout) => payout.amount !== '0')
        .map((payout) => ({
          ...payout,
          slotId: slot.id,
        })) ?? [],
  );

  const { annotatePayoutChannel, ...channels } =
    yield createTransactionChannels(meta.id, [
      ...payoutsWithSlotIds.map(getPayoutChannelId),
      'annotatePayoutChannel',
    ]);

  try {
    // Create one claim transaction for each slot
    yield all(
      payoutsWithSlotIds.map((payout, index) =>
        fork(createTransaction, channels[getPayoutChannelId(payout)].id, {
          context: ClientType.ColonyClient,
          methodName: 'claimExpenditurePayout',
          identifier: colonyAddress,
          params: [nativeExpenditureId, payout.slotId, payout.tokenAddress],
          group: {
            key: batchKey,
            id: meta.id,
            index,
          },
          ready: false,
        }),
      ),
    );
    if (annotationMessage) {
      yield fork(createTransaction, annotatePayoutChannel.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: payoutsWithSlotIds.length,
        },
        ready: false,
      });
    }

    for (const payout of payoutsWithSlotIds) {
      const payoutChannelId = getPayoutChannelId(payout);

      yield takeFrom(
        channels[payoutChannelId].channel,
        ActionTypes.TRANSACTION_CREATED,
      );
      if (annotationMessage) {
        yield takeFrom(
          annotatePayoutChannel.channel,
          ActionTypes.TRANSACTION_CREATED,
        );
      }

      const {
        payload: { hash: txHash },
      } = yield takeFrom(
        channels[getPayoutChannelId(payout)].channel,
        ActionTypes.TRANSACTION_HASH_RECEIVED,
      );

      yield initiateTransaction({ id: channels[payoutChannelId].id });
      yield waitForTxResult(channels[payoutChannelId].channel);

      if (annotationMessage) {
        yield uploadAnnotation({
          txChannel: annotatePayoutChannel,
          message: annotationMessage,
          txHash,
        });
      }
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CLAIM_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.EXPENDITURE_CLAIM_ERROR, error, meta);
  } finally {
    for (const payout of payoutsWithSlotIds) {
      const payoutChannelId = getPayoutChannelId(payout);
      channels[payoutChannelId].channel.close();
    }
    annotatePayoutChannel.channel.close();
  }

  return null;
}

export default function* claimExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CLAIM, claimExpenditure);
}
