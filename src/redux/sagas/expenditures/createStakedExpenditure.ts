import { ClientType, Id, getChildIndex } from '@colony/colony-js';
import { takeEvery, fork, call, put } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';
import { ColonyManager } from '~context';
import { transactionAddParams } from '~redux/actionCreators';

import { ADDRESS_ZERO } from '~constants';

import {
  ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions';
import {
  getColonyManager,
  putError,
  takeFrom,
  getSetExpenditureValuesFunctionParams,
  saveExpenditureMetadata,
  initiateTransaction,
} from '../utils';

function* createStakedExpenditure({
  meta: { navigate, setTxHash },
  meta,
  payload: {
    colony: { name: colonyName, colonyAddress },
    payouts,
    createdInDomain,
    fundFromDomainId,
    stakeAmount,
    stakedExpenditureAddress,
    isStaged,
    stages,
  },
}: Action<ActionTypes.STAKED_EXPENDITURE_CREATE>) {
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
    approveStake,
    makeExpenditure,
    setExpenditureValues,
    setExpenditureStaged,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    [
      'approveStake',
      'makeExpenditure',
      'setExpenditureValues',
      'setExpenditureStaged',
    ],
  );

  try {
    yield fork(createTransaction, approveStake.id, {
      context: ClientType.ColonyClient,
      methodName: 'approveStake',
      identifier: colonyAddress,
      params: [stakedExpenditureAddress, createdInDomain.nativeId, stakeAmount],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
    });

    yield fork(createTransaction, makeExpenditure.id, {
      context: ClientType.StakedExpenditureClient,
      methodName: 'makeExpenditureWithStake',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 1,
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
        index: 2,
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
          index: 3,
        },
        ready: false,
      });
    }

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_CREATED);
    yield initiateTransaction({ id: approveStake.id });
    yield waitForTxResult(approveStake.channel);

    // Find a chill skill index as a proof the extension has permissions in the selected domain
    const childSkillIndex = yield getChildIndex(
      colonyClient.networkClient,
      colonyClient,
      // StakedExpenditure extension will always have its permissions assigned in the root domain
      Id.RootDomain,
      createdInDomain.nativeId,
    );

    // Get reputation proof for the selected domain
    const {
      key: reputationKey,
      value: reputationValue,
      branchMask,
      siblings,
    } = yield colonyClient.getReputation(
      createdInDomain.nativeSkillId,
      ADDRESS_ZERO,
    );

    yield takeFrom(makeExpenditure.channel, ActionTypes.TRANSACTION_CREATED);
    yield put(
      transactionAddParams(makeExpenditure.id, [
        Id.RootDomain,
        childSkillIndex,
        createdInDomain.nativeId,
        reputationKey,
        reputationValue,
        branchMask,
        siblings,
      ]),
    );
    yield initiateTransaction({ id: makeExpenditure.id });
    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      makeExpenditure.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);
    yield waitForTxResult(makeExpenditure.channel);

    const expenditureId = yield call(colonyClient.getExpenditureCount);

    yield takeFrom(
      setExpenditureValues.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    yield put(
      transactionAddParams(
        setExpenditureValues.id,
        getSetExpenditureValuesFunctionParams(
          expenditureId,
          payoutsWithSlotIds,
        ),
      ),
    );
    yield initiateTransaction({ id: setExpenditureValues.id });
    yield waitForTxResult(setExpenditureValues.channel);

    if (isStaged) {
      yield takeFrom(
        setExpenditureStaged.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
      yield put(
        transactionAddParams(setExpenditureStaged.id, [expenditureId, true]),
      );
      yield initiateTransaction({ id: setExpenditureStaged.id });
      yield waitForTxResult(setExpenditureStaged.channel);
    }

    yield saveExpenditureMetadata({
      colonyAddress,
      expenditureId,
      fundFromDomainId,
      stages: isStaged ? stages : undefined,
      stakeAmount,
    });

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CREATE_SUCCESS,
      payload: {},
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CREATE_ERROR, error, meta);
  } finally {
    [
      approveStake,
      makeExpenditure,
      setExpenditureValues,
      setExpenditureStaged,
    ].forEach(({ channel }) => channel.close());
  }
  return null;
}

export default function* createStakedExpenditureSaga() {
  yield takeEvery(
    ActionTypes.STAKED_EXPENDITURE_CREATE,
    createStakedExpenditure,
  );
}
