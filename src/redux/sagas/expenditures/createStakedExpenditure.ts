import {
  ClientType,
  Id,
  type TokenLockingClient,
  getChildIndex,
} from '@colony/colony-js';
import { takeEvery, call, put } from 'redux-saga/effects';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { type ColonyManager } from '~context/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import {
  transactionSetParams,
  updateTransaction,
} from '~state/transactionState.ts';

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
  createActionMetadataInDB,
  adjustPayoutsAddresses,
} from '../utils/index.ts';
import { chunkedMulticall } from '../utils/multicall.ts';

export type CreateStakedExpenditurePayload =
  Action<ActionTypes.STAKED_EXPENDITURE_CREATE>['payload'];

function* createStakedExpenditure({
  meta,
  meta: { setTxHash },
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
    customActionTitle,
  },
}: Action<ActionTypes.STAKED_EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield call(getColonyManager);
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const { network } = colonyManager.networkClient;

  const batchKey = 'createExpenditure';

  const adjustedPayouts = yield adjustPayoutsAddresses(payouts, network);

  const tokenLockingClient: TokenLockingClient = yield colonyManager.getClient(
    ClientType.TokenLockingClient,
    colonyAddress,
  );

  const {
    approve,
    deposit,
    approveStake,
    makeExpenditure,
    setExpenditureStaged,
    annotateMakeStagedExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    [
      'approve',
      'deposit',
      'approveStake',
      'makeExpenditure',
      'setExpenditureStaged',
      'annotateMakeStagedExpenditure',
    ],
  );

  const {
    createMulticallChannels,
    createMulticallTransactions,
    processMulticallTransactions,
    closeMulticallChannels,
  } = chunkedMulticall({
    colonyAddress,
    items: getPayoutsWithSlotIds(adjustedPayouts),
    // In testing, if this was called with more than 164 payouts
    // the resulting transaction receipt was too big to update the transaction in the db
    chunkSize: 164,
    metaId: meta.id,
    batchKey,
    startIndex: 4,
    channelId: 'setExpenditureValues',
  });

  yield createMulticallChannels();

  try {
    const needsActivatingTokens = stakeAmount.gt(activeBalance);

    if (needsActivatingTokens) {
      const missingActiveTokens = stakeAmount.sub(activeBalance);

      yield createGroupTransaction({
        channel: approve,
        batchKey,
        meta,
        config: {
          context: ClientType.TokenClient,
          methodName: 'approve',
          identifier: tokenAddress,
          params: [tokenLockingClient.address, missingActiveTokens],
          ready: false,
        },
      });

      yield createGroupTransaction({
        channel: deposit,
        batchKey,
        meta,
        config: {
          context: ClientType.TokenLockingClient,
          methodName: 'deposit(address,uint256,bool)',
          identifier: colonyAddress,
          params: [tokenAddress, missingActiveTokens, false],
          ready: false,
        },
      });
    }

    yield createGroupTransaction({
      channel: approveStake,
      batchKey,
      meta,
      config: {
        context: ClientType.ColonyClient,
        methodName: 'approveStake',
        identifier: colonyAddress,
        params: [
          stakedExpenditureAddress,
          createdInDomain.nativeId,
          stakeAmount,
        ],
        ready: false,
      },
    });

    yield createGroupTransaction({
      channel: makeExpenditure,
      batchKey,
      meta,
      config: {
        context: ClientType.StakedExpenditureClient,
        methodName: 'makeExpenditureWithStake',
        identifier: colonyAddress,
        ready: false,
      },
    });

    yield* createMulticallTransactions();

    if (isStaged) {
      yield createGroupTransaction({
        channel: setExpenditureStaged,
        batchKey,
        meta,
        config: {
          context: ClientType.StagedExpenditureClient,
          methodName: 'setExpenditureStaged',
          identifier: colonyAddress,
          ready: false,
        },
      });
    }

    if (annotationMessage) {
      yield createGroupTransaction({
        channel: annotateMakeStagedExpenditure,
        batchKey,
        meta,
        config: {
          context: ClientType.ColonyClient,
          methodName: 'annotateTransaction',
          identifier: colonyAddress,
          ready: false,
        },
      });
    }

    if (needsActivatingTokens) {
      yield takeFrom(approve.channel, ActionTypes.TRANSACTION_CREATED);
      yield initiateTransaction(approve.id);
      yield waitForTxResult(approve.channel);

      yield takeFrom(deposit.channel, ActionTypes.TRANSACTION_CREATED);
      yield initiateTransaction(deposit.id);
      yield waitForTxResult(deposit.channel);
    }

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_CREATED);
    yield initiateTransaction(approveStake.id);
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

    transactionSetParams(makeExpenditure.id, [
      Id.RootDomain,
      childSkillIndex,
      createdInDomain.nativeId,
      reputationKey,
      reputationValue,
      branchMask,
      siblings,
    ]);

    if (annotationMessage) {
      yield takeFrom(
        annotateMakeStagedExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }
    yield initiateTransaction(makeExpenditure.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(makeExpenditure.channel);

    const expenditureId = yield call(colonyClient.getExpenditureCount);

    yield processMulticallTransactions({
      encodeFunctionData: (payoutsChunk) =>
        getEditDraftExpenditureMulticallData({
          expenditureId,
          payouts: payoutsChunk,
          isStaged,
          colonyClient,
          networkInverseFee,
        }),
    });

    if (customActionTitle) {
      yield createActionMetadataInDB(txHash, {
        customTitle: customActionTitle,
      });
    }

    if (isStaged) {
      yield takeFrom(
        setExpenditureStaged.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
      yield transactionSetParams(setExpenditureStaged.id, [
        expenditureId,
        true,
      ]);
      yield initiateTransaction(setExpenditureStaged.id);
      yield waitForTxResult(setExpenditureStaged.channel);
    }

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMakeStagedExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    const numberOfTokens = new Set(payouts.map((payout) => payout.tokenAddress))
      .size;

    yield saveExpenditureMetadata({
      colonyAddress,
      expenditureId,
      fundFromDomainId,
      stages: isStaged ? stages : undefined,
      numberOfPayouts: payouts.length,
      numberOfTokens,
      distributionType,
    });

    yield put<AllActions>({
      type: ActionTypes.STAKED_EXPENDITURE_CREATE_SUCCESS,
      payload: {},
      meta,
    });

    setTxHash?.(txHash);

    [
      approve,
      deposit,
      approveStake,
      makeExpenditure,
      setExpenditureStaged,
      annotateMakeStagedExpenditure,
    ].forEach(({ id }) => {
      updateTransaction({ id, associatedActionId: txHash });
    });
  } catch (error) {
    return yield putError(
      ActionTypes.STAKED_EXPENDITURE_CREATE_ERROR,
      error,
      meta,
    );
  } finally {
    [
      approve,
      deposit,
      approveStake,
      makeExpenditure,
      setExpenditureStaged,
      annotateMakeStagedExpenditure,
    ].forEach(({ channel }) => channel.close());

    closeMulticallChannels();
  }
  return null;
}

export default function* createStakedExpenditureSaga() {
  yield takeEvery(
    ActionTypes.STAKED_EXPENDITURE_CREATE,
    createStakedExpenditure,
  );
}
