import { ClientType } from '@colony/colony-js';
import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { BigNumber } from 'ethers';

import { Action, ActionTypes, AllActions } from '~redux';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~redux/actionCreators';

import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
} from '../transactions';
import { putError, takeFrom } from '../utils';

function* fundExpenditure({
  payload: { colonyAddress, expenditure, fromDomainFundingPotId },
  meta,
}: Action<ActionTypes.EXPENDITURE_FUND>) {
  const { nativeFundingPotId: expenditureFundingPotId } = expenditure;

  const batchKey = 'fundExpenditure';

  // Create a map between token addresses and the total amount of the payouts for each token
  // We will call one moveFunds method for each token address instead of each payout to save gas
  const balancesByTokenAddresses = new Map<string, BigNumber>();
  expenditure.slots.forEach((slot) => {
    slot.payouts?.forEach((payout) => {
      const currentBalance =
        balancesByTokenAddresses.get(payout.tokenAddress) ?? '0';
      balancesByTokenAddresses.set(
        payout.tokenAddress,
        BigNumber.from(payout.amount).add(currentBalance),
      );
    });
  });

  // Create channel for each token, using its address as channel id
  const channels: Record<string, ChannelDefinition> =
    yield createTransactionChannels(meta.id, [
      ...balancesByTokenAddresses.keys(),
    ]);

  try {
    yield all(
      [...balancesByTokenAddresses.keys()].map((tokenAddress, index) =>
        fork(createTransaction, channels[tokenAddress].id, {
          context: ClientType.ColonyClient,
          methodName:
            'moveFundsBetweenPotsWithProofs(uint256,uint256,uint256,address)',
          identifier: colonyAddress,
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
      [...balancesByTokenAddresses.entries()]
        .map(([tokenAddress, amount]) => [
          put(transactionPending(channels[tokenAddress].id)),
          put(
            transactionAddParams(channels[tokenAddress].id, [
              fromDomainFundingPotId,
              expenditureFundingPotId,
              amount,
              tokenAddress,
            ]),
          ),
          put(transactionReady(channels[tokenAddress].id)),
          takeFrom(
            channels[tokenAddress].channel,
            ActionTypes.TRANSACTION_SUCCEEDED,
          ),
        ])
        .flat(),
    );

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_FUND_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_FUND_ERROR, error, meta);
  }

  [...balancesByTokenAddresses.keys()].forEach((tokenAddress) =>
    channels[tokenAddress].channel.close(),
  );

  return null;
}

export default function* fundExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FUND, fundExpenditure);
}
