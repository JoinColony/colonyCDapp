import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';

import { Action, ActionTypes, AllActions } from '~redux';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~redux/actionCreators';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

import { putError, takeFrom } from '../utils';
import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
} from '../transactions';
import { groupExpenditureSlotsByTokenAddresses } from '../utils/expenditures';

function* editExpenditure({
  payload: { colonyAddress, expenditure, slots },
  meta,
}: Action<ActionTypes.EXPENDITURE_EDIT>) {
  const batchKey = 'editExpenditure';

  // Group slots by token address, this is useful as we need to call setExpenditurePayouts method separately for each token
  const slotsByTokenAddress = groupExpenditureSlotsByTokenAddresses(slots);

  const {
    setRecipients,
    ...setPayoutsChannels
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    [
      'setRecipients',
      // setExpenditurePayouts transactions will use token address as channel id
      ...slotsByTokenAddress.keys(),
    ],
  );

  try {
    yield fork(createTransaction, setRecipients.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureRecipients',
      identifier: colonyAddress,
      params: [
        expenditure.nativeId,
        slots.map((_, index) => index + 1),
        slots.map((slot) => slot.recipientAddress),
      ],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
    });

    yield all(
      Object.values(setPayoutsChannels).map((channel, index) =>
        fork(createTransaction, channel.id, {
          context: ClientType.ColonyClient,
          methodName: 'setExpenditurePayouts',
          identifier: colonyAddress,
          group: {
            key: batchKey,
            id: meta.id,
            index: index + 1,
          },
          ready: false,
        }),
      ),
    );

    yield put(transactionPending(setRecipients.id));
    yield put(transactionReady(setRecipients.id));
    yield takeFrom(setRecipients.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    // Call setExpenditurePayouts for each token
    yield all(
      [...slotsByTokenAddress.entries()]
        .map(([tokenAddress, tokenSlots]) => [
          put(transactionPending(setPayoutsChannels[tokenAddress].id)),
          put(
            transactionAddParams(setPayoutsChannels[tokenAddress].id, [
              expenditure.nativeId,
              tokenSlots.map((slot) => slot.id),
              tokenAddress,
              tokenSlots.map((slot) =>
                BigNumber.from(slot.amount).mul(
                  // @TODO: This should get the token decimals of the selected token
                  BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS),
                ),
              ),
            ]),
          ),
          put(transactionReady(setPayoutsChannels[tokenAddress].id)),
          takeFrom(
            setPayoutsChannels[tokenAddress].channel,
            ActionTypes.TRANSACTION_SUCCEEDED,
          ),
        ])
        .flat(),
    );

    // @TODO: Call contract methods to remove the "remaining" expenditure slots

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_EDIT_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_EDIT_ERROR, error, meta);
  }

  [setRecipients, ...Object.values(setPayoutsChannels)].map((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* editExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_EDIT, editExpenditure);
}
