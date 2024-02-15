import { ClientType } from '@colony/colony-js';
import { all, fork, put, takeEvery } from 'redux-saga/effects';

import {
  transactionAddParams,
  transactionPending,
} from '~redux/actionCreators/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import { getExpenditureBalancesByTokenAddress } from '../utils/expenditures.ts';
import { initiateTransaction, putError, takeFrom } from '../utils/index.ts';

export type FundExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_FUND>['payload'];

function* fundExpenditure({
  payload: { colonyAddress, expenditure, fromDomainFundingPotId },
  meta,
}: Action<ActionTypes.EXPENDITURE_FUND>) {
  const { nativeFundingPotId: expenditureFundingPotId } = expenditure;

  const batchKey = 'fundExpenditure';

  // Create a map between token addresses and the total amount of the payouts for each token
  // We will call one moveFunds method for each token address instead of each payout to save gas
  const balancesByTokenAddresses =
    getExpenditureBalancesByTokenAddress(expenditure);

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

    for (const [tokenAddress, amount] of [
      ...balancesByTokenAddresses.entries(),
    ]) {
      yield takeFrom(
        channels[tokenAddress].channel,
        ActionTypes.TRANSACTION_CREATED,
      );
      yield put(transactionPending(channels[tokenAddress].id));
      yield put(
        transactionAddParams(channels[tokenAddress].id, [
          fromDomainFundingPotId,
          expenditureFundingPotId,
          amount,
          tokenAddress,
        ]),
      );
      yield initiateTransaction({ id: channels[tokenAddress].id });
      yield waitForTxResult(channels[tokenAddress].channel);
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_FUND_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_FUND_ERROR, error, meta);
  } finally {
    [...balancesByTokenAddresses.keys()].forEach((tokenAddress) =>
      channels[tokenAddress].channel.close(),
    );
  }

  return null;
}

export default function* fundExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FUND, fundExpenditure);
}
