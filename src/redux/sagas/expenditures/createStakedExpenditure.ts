import { ClientType, Id, getChildIndex } from '@colony/colony-js';
import { takeEvery, fork, call, put } from 'redux-saga/effects';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { type ColonyManager } from '~context/index.ts';
import { transactionAddParams } from '~redux/actionCreators/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  putError,
  takeFrom,
  getSetExpenditureValuesFunctionParams,
  saveExpenditureMetadata,
  initiateTransaction,
  uploadAnnotation,
  getPayoutsWithSlotIds,
} from '../utils/index.ts';

export type CreateStakedExpenditurePayload =
  Action<ActionTypes.STAKED_EXPENDITURE_CREATE>['payload'];

function* createStakedExpenditure({
  meta,
  payload: {
    colonyAddress,
    payouts,
    createdInDomain,
    fundFromDomainId,
    stakeAmount,
    stakedExpenditureAddress,
    isStaged,
    stages,
    networkInverseFee,
    annotationMessage,
  },
}: Action<ActionTypes.STAKED_EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const batchKey = TRANSACTION_METHODS.CreateExpenditure;

  const payoutsWithSlotIds = getPayoutsWithSlotIds(payouts);

  const {
    approveStake,
    makeExpenditure,
    setExpenditureValues,
    setExpenditureStaged,
    annotateMakeStagedExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    [
      'approveStake',
      'makeExpenditure',
      'setExpenditureValues',
      'setExpenditureStaged',
      'annotateMakeStagedExpenditure',
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

    if (annotationMessage) {
      yield fork(createTransaction, annotateMakeStagedExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: isStaged ? 4 : 3,
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

    if (annotationMessage) {
      yield takeFrom(
        annotateMakeStagedExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }
    yield initiateTransaction({ id: makeExpenditure.id });

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(makeExpenditure.channel);

    const expenditureId = yield call(colonyClient.getExpenditureCount);

    yield takeFrom(
      setExpenditureValues.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    yield put(
      transactionAddParams(
        setExpenditureValues.id,
        getSetExpenditureValuesFunctionParams({
          nativeExpenditureId: expenditureId,
          payouts: payoutsWithSlotIds,
          networkInverseFee,
          isStaged,
        }),
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

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMakeStagedExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    yield saveExpenditureMetadata({
      colonyAddress,
      expenditureId,
      fundFromDomainId,
      stages: isStaged ? stages : undefined,
    });

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_CREATE_SUCCESS,
      payload: {},
      meta,
    });

    // @TODO: Remove during advanced payments UI wiring
    // eslint-disable-next-line no-console
    console.log('Created expenditure ID:', expenditureId.toString());
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CREATE_ERROR, error, meta);
  } finally {
    [
      approveStake,
      makeExpenditure,
      setExpenditureValues,
      setExpenditureStaged,
      annotateMakeStagedExpenditure,
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
