import {
  ClientType,
  Id,
  type TokenLockingClient,
  getChildIndex,
} from '@colony/colony-js';
import { takeEvery, call, put } from 'redux-saga/effects';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { type ColonyManager } from '~context/index.ts';
import { transactionAddParams } from '~redux/actionCreators/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  type ChannelDefinition,
  createTransactionChannels,
  waitForTxResult,
  createGroupTransaction,
} from '../transactions/index.ts';
import {
  getColonyManager,
  putError,
  takeFrom,
  saveExpenditureMetadata,
  initiateTransaction,
  uploadAnnotation,
  getPayoutsWithSlotIds,
  getEditDraftExpenditureMulticallData,
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
    distributionType,
    activeBalance = '0',
    tokenAddress,
  },
}: Action<ActionTypes.STAKED_EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield call(getColonyManager);
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const batchKey = TRANSACTION_METHODS.CreateExpenditure;

  const payoutsWithSlotIds = getPayoutsWithSlotIds(payouts);

  const tokenLockingClient: TokenLockingClient = yield colonyManager.getClient(
    ClientType.TokenLockingClient,
    colonyAddress,
  );

  const {
    approve,
    deposit,
    approveStake,
    makeExpenditure,
    setExpenditureValues,
    setExpenditureStaged,
    annotateMakeStagedExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    [
      'approve',
      'deposit',
      'approveStake',
      'makeExpenditure',
      'setExpenditureValues',
      'setExpenditureStaged',
      'annotateMakeStagedExpenditure',
    ],
  );

  try {
    if (stakeAmount.gt(activeBalance)) {
      const missingActiveTokens = stakeAmount.sub(activeBalance);

      yield createGroupTransaction(approve, batchKey, meta, {
        context: ClientType.TokenClient,
        methodName: 'approve',
        identifier: tokenAddress,
        params: [tokenLockingClient.address, missingActiveTokens],
        ready: false,
      });

      yield createGroupTransaction(deposit, batchKey, meta, {
        context: ClientType.TokenLockingClient,
        methodName: 'deposit(address,uint256,bool)',
        identifier: colonyAddress,
        params: [tokenAddress, missingActiveTokens, false],
        ready: false,
      });
    }

    yield createGroupTransaction(approveStake, batchKey, meta, {
      context: ClientType.ColonyClient,
      methodName: 'approveStake',
      identifier: colonyAddress,
      params: [stakedExpenditureAddress, createdInDomain.nativeId, stakeAmount],
      ready: false,
    });

    yield createGroupTransaction(makeExpenditure, batchKey, meta, {
      context: ClientType.StakedExpenditureClient,
      methodName: 'makeExpenditureWithStake',
      identifier: colonyAddress,
      ready: false,
    });

    yield createGroupTransaction(setExpenditureValues, batchKey, meta, {
      context: ClientType.ColonyClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      ready: false,
    });

    if (isStaged) {
      yield createGroupTransaction(setExpenditureStaged, batchKey, meta, {
        context: ClientType.StagedExpenditureClient,
        methodName: 'setExpenditureStaged',
        identifier: colonyAddress,
        ready: false,
      });
    }

    if (annotationMessage) {
      yield createGroupTransaction(
        annotateMakeStagedExpenditure,
        batchKey,
        meta,
        {
          context: ClientType.ColonyClient,
          methodName: 'annotateTransaction',
          identifier: colonyAddress,
          ready: false,
        },
      );
    }

    yield takeFrom(approve.channel, ActionTypes.TRANSACTION_CREATED);
    yield initiateTransaction({ id: approve.id });
    yield waitForTxResult(approve.channel);

    yield takeFrom(deposit.channel, ActionTypes.TRANSACTION_CREATED);
    yield initiateTransaction({ id: deposit.id });
    yield waitForTxResult(deposit.channel);

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_CREATED);
    yield initiateTransaction({ id: approveStake.id });
    yield waitForTxResult(approveStake.channel);

    // Find a child skill index as a proof the extension has permissions in the selected domain
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

    const multicallData = getEditDraftExpenditureMulticallData({
      expenditureId,
      payouts: payoutsWithSlotIds,
      colonyClient,
      networkInverseFee,
    });

    yield put(transactionAddParams(setExpenditureValues.id, [multicallData]));
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
      distributionType,
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
