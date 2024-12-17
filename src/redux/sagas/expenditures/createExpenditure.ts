import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { takeEvery, fork, call, put } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { transactionSetParams } from '~state/transactionState.ts';

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
  saveExpenditureMetadata,
  initiateTransaction,
  uploadAnnotation,
  getPayoutsWithSlotIds,
  createActionMetadataInDB,
  adjustPayoutsAddresses,
  getEditDraftExpenditureMulticallData,
} from '../utils/index.ts';
import { chunkedMulticall } from '../utils/multicall.ts';

export type CreateExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_CREATE>['payload'];

function* createExpenditure({
  meta,
  meta: { setTxHash },
  payload: {
    colonyAddress,
    payouts,
    fundFromDomainId,
    isStaged,
    stages,
    networkInverseFee,
    annotationMessage,
    customActionTitle,
    distributionType,
  },
}: Action<ActionTypes.EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const { network } = colonyManager.networkClient;

  const batchKey = 'createExpenditure';

  const adjustedPayouts = yield adjustPayoutsAddresses(payouts, network);

  const {
    makeExpenditure,
    setExpenditureStaged,
    annotateMakeExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['makeExpenditure', 'setExpenditureStaged', 'annotateMakeExpenditure'],
  );

  const {
    createMulticallChannels,
    createMulticallTransactions,
    processMulticallTransactions,
    closeMulticallChannels,
    finalMulticallGroupIndex,
  } = chunkedMulticall({
    colonyAddress,
    items: getPayoutsWithSlotIds(adjustedPayouts),
    // In testing, if this was called with more than 164 payouts
    // the resulting transaction receipt was too big to update the transaction in the db
    chunkSize: 164,
    metaId: meta.id,
    batchKey,
    startIndex: 1,
    channelId: 'setExpenditureValues',
  });

  yield createMulticallChannels();

  try {
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      fundFromDomainId,
      ColonyRole.Administration,
    );

    yield fork(createTransaction, makeExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'makeExpenditure',
      identifier: colonyAddress,
      params: [permissionDomainId, childSkillIndex, fundFromDomainId],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
    });

    yield* createMulticallTransactions();

    const nextIndex = finalMulticallGroupIndex + 1;

    if (isStaged) {
      yield fork(createTransaction, setExpenditureStaged.id, {
        context: ClientType.StagedExpenditureClient,
        methodName: 'setExpenditureStaged',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: nextIndex,
        },
        ready: false,
      });
    }

    if (annotationMessage) {
      yield fork(createTransaction, annotateMakeExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: isStaged ? nextIndex + 1 : nextIndex,
        },
        ready: false,
      });
    }

    yield takeFrom(makeExpenditure.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateMakeExpenditure.channel,
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
        txChannel: annotateMakeExpenditure,
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
      type: ActionTypes.EXPENDITURE_CREATE_SUCCESS,
      payload: {},
      meta,
    });

    setTxHash?.(txHash);
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CREATE_ERROR, error, meta);
  }

  [makeExpenditure, setExpenditureStaged, annotateMakeExpenditure].forEach(
    (channel) => channel.channel.close(),
  );

  closeMulticallChannels();

  return null;
}

export default function* createExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CREATE, createExpenditure);
}
