import { ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import { BatchKeys } from '~types/transactions.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  putError,
  getSetExpenditureValuesFunctionParams,
  initiateTransaction,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

function* editExpenditureAction({
  payload: {
    colonyAddress,
    expenditure,
    payouts,
    networkInverseFee,
    annotationMessage,
  },
  meta,
}: Action<ActionTypes.EXPENDITURE_EDIT>) {
  const batchKey = BatchKeys.CreateExpenditure;

  const payoutsWithSlotIds = payouts.map((payout, index) => ({
    ...payout,
    slotId: index + 1,
  }));

  /**
   * @NOTE: Resolving payouts means making sure that for every slot, there's only one payout with non-zero amount.
   * This is to meet the UI requirement that there should be one payout per row.
   */
  const resolvedPayouts: ExpenditurePayoutFieldValue[] = [];

  payoutsWithSlotIds.forEach((payout) => {
    // Add payout as specified in the form
    resolvedPayouts.push(payout);

    const existingSlot = expenditure.slots.find(
      (slot) => slot.id === payout.slotId,
    );

    // Set the amounts for any existing payouts in different tokens to 0
    resolvedPayouts.push(
      ...(existingSlot?.payouts
        ?.filter(
          (slotPayout) =>
            slotPayout.tokenAddress !== payout.tokenAddress &&
            BigNumber.from(slotPayout.amount).gt(0),
        )
        .map((slotPayout) => ({
          slotId: payout.slotId,
          recipientAddress: payout.recipientAddress,
          tokenAddress: slotPayout.tokenAddress,
          amount: '0',
          claimDelay: payout.claimDelay,
        })) ?? []),
    );
  });

  // If there are now less payouts than expenditure slots, we need to remove them by setting their amounts to 0
  const remainingSlots = expenditure.slots.slice(payouts.length);
  remainingSlots.forEach((slot) => {
    slot.payouts?.forEach((payout) => {
      resolvedPayouts.push({
        slotId: slot.id,
        recipientAddress: slot.recipientAddress ?? '',
        tokenAddress: payout.tokenAddress,
        amount: '0',
        claimDelay: slot.claimDelay ?? 0,
      });
    });
  });

  const {
    editExpenditure,
    annotateEditExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['editExpenditure', 'annotateEditExpenditure'],
  );

  try {
    yield fork(createTransaction, editExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureValues',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: getSetExpenditureValuesFunctionParams(
        expenditure.nativeId,
        resolvedPayouts,
        networkInverseFee,
      ),
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateEditExpenditure.id, {
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

    yield takeFrom(editExpenditure.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateEditExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: editExpenditure.id });
    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      editExpenditure.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield waitForTxResult(editExpenditure.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateEditExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_EDIT_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_EDIT_ERROR, error, meta);
  }
  [editExpenditure, annotateEditExpenditure].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* editExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_EDIT, editExpenditureAction);
}
