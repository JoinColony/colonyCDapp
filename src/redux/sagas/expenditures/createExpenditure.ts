import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { takeEvery, fork, call, put } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';
import { ColonyManager } from '~context';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~redux/actionCreators';
import { ExpenditureType } from '~gql';

import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
} from '../transactions';
import {
  getColonyManager,
  putError,
  takeFrom,
  getSetExpenditureValuesFunctionParams,
  saveExpenditureMetadata,
} from '../utils';

export type CreateExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_CREATE>['payload'];

function* createExpenditure({
  meta: { navigate },
  meta,
  payload: {
    colony: { name: colonyName, colonyAddress },
    payouts,
    createdInDomain,
    fundFromDomainId,
    isStaged,
    stages,
  },
}: Action<ActionTypes.EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const batchKey = 'createExpenditure';

  // Add slot id to each payout
  const payoutsWithSlotIds = payouts.map((payout, index) => ({
    ...payout,
    slotId: index + 1,
  }));

  const {
    makeExpenditure,
    setExpenditureValues,
    setExpenditureStaged,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['makeExpenditure', 'setExpenditureValues', 'setExpenditureStaged'],
  );

  try {
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient,
      createdInDomain.nativeId,
      ColonyRole.Administration,
    );

    yield fork(createTransaction, makeExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'makeExpenditure',
      identifier: colonyAddress,
      params: [permissionDomainId, childSkillIndex, createdInDomain.nativeId],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
    });

    yield fork(createTransaction, setExpenditureValues.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureValues',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 1,
      },
      ready: false,
    });

    if (isStaged) {
      yield fork(createTransaction, setExpenditureStaged.id, {
        context: ClientType.StagedExpenditureClient,
        methodName: 'setExpenditureStaged',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 2,
        },
        ready: false,
      });
    }

    yield put(transactionPending(makeExpenditure.id));
    yield put(transactionReady(makeExpenditure.id));
    yield takeFrom(makeExpenditure.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    const expenditureId = yield call(colonyClient.getExpenditureCount);

    yield put(transactionPending(setExpenditureValues.id));
    yield put(
      transactionAddParams(
        setExpenditureValues.id,
        getSetExpenditureValuesFunctionParams(
          expenditureId,
          payoutsWithSlotIds,
        ),
      ),
    );
    yield put(transactionReady(setExpenditureValues.id));
    yield takeFrom(
      setExpenditureValues.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    if (isStaged) {
      yield put(transactionPending(setExpenditureStaged.id));
      yield put(
        transactionAddParams(setExpenditureStaged.id, [expenditureId, true]),
      );
      yield put(transactionReady(setExpenditureStaged.id));
      yield takeFrom(
        setExpenditureStaged.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    yield saveExpenditureMetadata({
      colonyAddress,
      expenditureId,
      fundFromDomainId,
      expenditureType: ExpenditureType.Forced,
      stages: isStaged ? stages : undefined,
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

  [makeExpenditure, setExpenditureValues, setExpenditureStaged].forEach(
    (channel) => channel.channel.close(),
  );

  return null;
}

export default function* createExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CREATE, createExpenditure);
}
