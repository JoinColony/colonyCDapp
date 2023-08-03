import { ClientType } from '@colony/colony-js';
import { takeEvery, fork, call, put } from 'redux-saga/effects';
import { BigNumber } from 'ethers';

import { Action, ActionTypes, AllActions } from '~redux';
import { ColonyManager, ContextModule, getContext } from '~context';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { getColonyManager, putError, takeFrom } from '../utils';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~redux/actionCreators';
import {
  CreateExpenditureMetadataDocument,
  CreateExpenditureMetadataMutation,
  CreateExpenditureMetadataMutationVariables,
} from '~gql';
import { getExpenditureDatabaseId } from '~utils/databaseId';
import { toNumber } from '~utils/numbers';

function* createExpenditure({
  meta: { id: metaId, navigate },
  meta,
  payload: {
    colonyName,
    colonyAddress,
    recipientAddress,
    tokenAddress,
    amount,
    domainId,
  },
}: Action<ActionTypes.EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const apolloClient = getContext(ContextModule.ApolloClient);

  const txChannel = yield call(getTxChannel, metaId);
  const batchKey = 'createExpenditure';

  try {
    const { makeExpenditure, setRecipients, setPayouts } =
      yield createTransactionChannels(metaId, [
        'makeExpenditure',
        'setRecipients',
        'setPayouts',
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
      ready: false,
    });

    yield fork(createTransaction, setRecipients.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureRecipients',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: metaId,
        index: 1,
      },
      ready: false,
    });

    yield fork(createTransaction, setPayouts.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditurePayouts',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: metaId,
        index: 2,
      },
      ready: false,
    });

    yield put(transactionPending(makeExpenditure.id));
    yield put(transactionReady(makeExpenditure.id));
    yield takeFrom(makeExpenditure.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    const expenditureId = yield call(colonyClient.getExpenditureCount);

    yield put(transactionPending(setRecipients.id));
    yield put(
      transactionAddParams(setRecipients.id, [
        expenditureId,
        [1],
        [recipientAddress],
      ]),
    );
    yield put(transactionReady(setRecipients.id));

    yield takeFrom(setRecipients.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(transactionPending(setPayouts.id));
    yield put(
      transactionAddParams(setPayouts.id, [
        expenditureId,
        [1],
        tokenAddress,
        [amount],
      ]),
    );
    yield put(transactionReady(setPayouts.id));

    yield takeFrom(setPayouts.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield apolloClient.mutate<
      CreateExpenditureMetadataMutation,
      CreateExpenditureMetadataMutationVariables
    >({
      mutation: CreateExpenditureMetadataDocument,
      variables: {
        input: {
          id: getExpenditureDatabaseId(colonyAddress, toNumber(expenditureId)),
          nativeDomainId: domainId,
        },
      },
    });

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
