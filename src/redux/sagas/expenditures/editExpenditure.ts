import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';

import { Action, ActionTypes, AllActions } from '~redux';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { ExpenditurePayoutFieldValue } from '~common/Expenditures/ExpenditureForm';

import { putError, groupExpenditurePayoutsByTokenAddresses } from '../utils';
import { createTransaction, getTxChannel } from '../transactions';

function* editExpenditure({
  payload: { colonyAddress, expenditure, payouts },
  meta,
}: Action<ActionTypes.EXPENDITURE_EDIT>) {
  const txChannel = yield call(getTxChannel, meta.id);

  const payoutsWithSlotIds = payouts.map((payout, index) => ({
    ...payout,
    slotId: index + 1,
  }));

  const resolvedPayouts: ExpenditurePayoutFieldValue[] = [];

  payoutsWithSlotIds.forEach((payout) => {
    const existingSlot = expenditure.slots.find(
      (slot) => slot.id === payout.slotId,
    );

    resolvedPayouts.push(payout);

    // Set the amounts for any existing payouts in different tokens to 0
    resolvedPayouts.push(
      ...(existingSlot?.payouts
        ?.filter(
          (slotPayout) => slotPayout.tokenAddress !== payout.tokenAddress,
        )
        .map((slotPayout) => ({
          slotId: payout.slotId,
          recipientAddress: payout.recipientAddress,
          tokenAddress: slotPayout.tokenAddress,
          amount: '0',
        })) ?? []),
    );
  });

  // // Group slots by token address
  const payoutsByTokenAddresses =
    groupExpenditurePayoutsByTokenAddresses(payoutsWithSlotIds);

  // @TODO: If there are now less payouts than before, we need to remove the old ones

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureValues',
      identifier: colonyAddress,
      params: [
        expenditure.nativeId,
        // slot ids for recipients
        resolvedPayouts.map((payout) => payout.slotId ?? 0),
        // recipient addresses
        resolvedPayouts.map((payout) => payout.recipientAddress),
        // slot ids for skill ids
        [],
        // skill ids
        [],
        // slot ids for claim delays
        [],
        // claim delays
        [],
        // slot ids for payout modifiers
        [],
        // payout modifiers
        [],
        // token addresses
        [...payoutsByTokenAddresses.keys()],
        // 2-dimensional array mapping token addresses to slot ids
        [...payoutsByTokenAddresses.values()].map((payoutsByTokenAddress) =>
          payoutsByTokenAddress.map((payout) => payout.slotId ?? 0),
        ),
        // 2-dimensional array mapping token addresses to amounts
        [...payoutsByTokenAddresses.values()].map((payoutsByTokenAddress) =>
          payoutsByTokenAddress.map((payout) =>
            BigNumber.from(payout.amount).mul(
              // @TODO: This should get the token decimals of the selected token
              BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS),
            ),
          ),
        ),
      ],
    });

    // @TODO: Call contract methods to remove the "remaining" expenditure slots

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_EDIT_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_EDIT_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* editExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_EDIT, editExpenditure);
}
