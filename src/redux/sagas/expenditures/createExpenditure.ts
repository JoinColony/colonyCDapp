import { ClientType } from '@colony/colony-js';
import { takeEvery, fork, call, put } from 'redux-saga/effects';
import { BigNumber } from 'ethers';

import { Action, ActionTypes, AllActions } from '~redux';
import { ColonyManager } from '~context';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { getColonyManager, putError, takeFrom } from '../utils';

function* createExpenditure({
  meta: { id: metaId, navigate },
  meta,
  payload: {
    colonyName,
    colonyAddress,
    recipientAddress,
    tokenAddress,
    amount,
  },
}: Action<ActionTypes.EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const txChannel = yield call(getTxChannel, metaId);
  const batchKey = 'createExpenditure';

  try {
    const { makeExpenditure, setRecipient, setPayout } =
      yield createTransactionChannels(metaId, [
        'makeExpenditure',
        'setRecipient',
        'setPayout',
      ]);

    yield fork(createTransaction, makeExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'makeExpenditure',
      identifier: colonyAddress,
      params: [1, BigNumber.from(2).pow(256).sub(1), 1],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
    });

    yield takeFrom(makeExpenditure.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    const expenditureId = yield call(colonyClient.getExpenditureCount);

    yield fork(createTransaction, setRecipient.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureRecipient',
      identifier: colonyAddress,
      params: [expenditureId, 1, recipientAddress],
      group: {
        key: batchKey,
        id: metaId,
        index: 1,
      },
    });

    yield fork(createTransaction, setPayout.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditurePayout(uint256,uint256,address,uint256)',
      identifier: colonyAddress,
      params: [expenditureId, 1, tokenAddress, amount],
      group: {
        key: batchKey,
        id: metaId,
        index: 2,
      },
    });

    // Wait for tx success here?

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CREATE_SUCCESS,
      payload: {},
      meta,
    });

    navigate(`/colony/${colonyName}/expenditures/${expenditureId}`);
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CREATE_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* createExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CREATE, createExpenditure);
}
