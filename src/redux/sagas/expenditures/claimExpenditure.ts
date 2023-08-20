import { ClientType } from '@colony/colony-js';
import { takeEvery, fork, call, put, all } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';
import { transactionPending, transactionReady } from '~redux/actionCreators';
import { ExpenditurePayout } from '~types';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { putError, takeFrom } from '../utils';

type PayoutWithSlotId = ExpenditurePayout & {
  slotId: number;
};

const getPayoutChannelId = (payout: PayoutWithSlotId) =>
  `${payout.slotId}-${payout.tokenAddress}`;

function* claimExpenditure({
  meta,
  payload: { colonyAddress, expenditure },
}: Action<ActionTypes.EXPENDITURE_CLAIM>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const batchKey = 'claimExpenditure';

  const payoutsWithSlotIds = expenditure.slots.flatMap(
    (slot) =>
      slot.payouts?.map((payout) => ({
        ...payout,
        slotId: slot.id,
      })) ?? [],
  );

  try {
    const channels = yield createTransactionChannels(meta.id, [
      ...payoutsWithSlotIds.map(getPayoutChannelId),
    ]);

    // Create one claim transaction for each slot
    // @TODO: We should create one transaction for each token address
    yield all(
      payoutsWithSlotIds.map((payout, index) =>
        fork(createTransaction, channels[getPayoutChannelId(payout)].id, {
          context: ClientType.ColonyClient,
          methodName: 'claimExpenditurePayout',
          identifier: colonyAddress,
          params: [expenditure.nativeId, payout.slotId, payout.tokenAddress],
          group: {
            key: batchKey,
            id: meta.id,
            index,
          },
          ready: false,
        }),
      ),
    );

    yield all(
      payoutsWithSlotIds
        .map((payout) => {
          const payoutChannelId = getPayoutChannelId(payout);
          return [
            put(transactionPending(channels[payoutChannelId].id)),
            put(transactionReady(channels[payoutChannelId].id)),
            takeFrom(
              channels[payoutChannelId].channel,
              ActionTypes.TRANSACTION_SUCCEEDED,
            ),
          ];
        })
        .flat(),
    );

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CLAIM_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CLAIM_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* claimExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CLAIM, claimExpenditure);
}
