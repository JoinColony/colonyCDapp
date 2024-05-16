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
import {
  getMoveFundsPermissionProofs,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

export type FundExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_FUND>['payload'];

function* fundExpenditure({
  payload: {
    colonyAddress,
    expenditure,
    fromDomainFundingPotId,
    annotationMessage,
  },
  meta,
}: Action<ActionTypes.EXPENDITURE_FUND>) {
  const { nativeFundingPotId: expenditureFundingPotId } = expenditure;

  const batchKey = 'fundExpenditure';

  // Create a map between token addresses and the total amount of the payouts for each token
  // We will call one moveFunds method for each token address instead of each payout to save gas
  const balancesByTokenAddresses =
    getExpenditureBalancesByTokenAddress(expenditure);

  // Create channel for each token, using its address as channel id
  const {
    annotateFundExpenditure,
    ...channels
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    [...balancesByTokenAddresses.keys(), 'annotateFundExpenditure'],
  );

  try {
    yield all(
      [...balancesByTokenAddresses.keys()].map((tokenAddress, index) =>
        fork(createTransaction, channels[tokenAddress].id, {
          context: ClientType.ColonyClient,
          methodName:
            'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)',
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
    if (annotationMessage) {
      yield fork(createTransaction, annotateFundExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: Object.keys(balancesByTokenAddresses).length,
        },
        ready: false,
      });
    }

    for (const [tokenAddress, amount] of [
      ...balancesByTokenAddresses.entries(),
    ]) {
      yield takeFrom(
        channels[tokenAddress].channel,
        ActionTypes.TRANSACTION_CREATED,
      );
      if (annotationMessage) {
        yield takeFrom(
          annotateFundExpenditure.channel,
          ActionTypes.TRANSACTION_CREATED,
        );
      }

      yield put(transactionPending(channels[tokenAddress].id));

      const [permissionDomainId, fromChildSkillIndex, toChildSkillIndex] =
        yield getMoveFundsPermissionProofs(
          colonyAddress,
          fromDomainFundingPotId,
          expenditureFundingPotId,
        );
      yield put(
        transactionAddParams(channels[tokenAddress].id, [
          permissionDomainId,
          fromChildSkillIndex,
          permissionDomainId,
          fromChildSkillIndex,
          toChildSkillIndex,
          fromDomainFundingPotId,
          expenditureFundingPotId,
          amount,
          tokenAddress,
        ]),
      );

      yield initiateTransaction({ id: channels[tokenAddress].id });

      const {
        payload: { hash: txHash },
      } = yield takeFrom(
        channels[tokenAddress].channel,
        ActionTypes.TRANSACTION_HASH_RECEIVED,
      );

      yield waitForTxResult(channels[tokenAddress].channel);

      if (annotationMessage) {
        yield uploadAnnotation({
          txChannel: annotateFundExpenditure,
          message: annotationMessage,
          txHash,
        });
      }
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
    annotateFundExpenditure.channel.close();
  }

  return null;
}

export default function* fundExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FUND, fundExpenditure);
}
