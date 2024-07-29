import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { takeEvery, fork, call, put } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { transactionSetParams } from '~state/transactionState.ts';
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
  saveExpenditureMetadata,
  initiateTransaction,
  uploadAnnotation,
  getPayoutsWithSlotIds,
  getPayoutAmount,
  createActionMetadataInDB,
  adjustPayoutsAddresses,
} from '../utils/index.ts';

export type CreateExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_CREATE>['payload'];

function* createExpenditure({
  meta,
  meta: { setTxHash },
  payload: {
    colonyAddress,
    payouts,
    createdInDomain,
    fundFromDomainId,
    isStaged,
    stages,
    networkInverseFee,
    annotationMessage,
    customActionTitle,
  },
}: Action<ActionTypes.EXPENDITURE_CREATE>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const { network } = colonyManager.networkClient;

  const batchKey = TRANSACTION_METHODS.CreateExpenditure;

  const adjustedPayouts = yield adjustPayoutsAddresses(payouts, network);
  const payoutsWithSlotIds = getPayoutsWithSlotIds(adjustedPayouts);

  const {
    makeExpenditure,
    setExpenditureValues,
    setExpenditureStaged,
    annotateMakeExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    [
      'makeExpenditure',
      'setExpenditureValues',
      'setExpenditureStaged',
      'annotateMakeExpenditure',
    ],
  );

  try {
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
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
      methodName: 'multicall',
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

    if (annotationMessage) {
      yield fork(createTransaction, annotateMakeExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: isStaged ? 3 : 2,
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

    yield takeFrom(
      setExpenditureValues.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    const multicallData: string[] = [];
    multicallData.push(
      colonyClient.interface.encodeFunctionData('setExpenditureRecipients', [
        expenditureId,
        payoutsWithSlotIds.map((payout) => payout.slotId),
        payoutsWithSlotIds.map((payout) => payout.recipientAddress),
      ]),
    );

    multicallData.push(
      colonyClient.interface.encodeFunctionData('setExpenditureClaimDelays', [
        expenditureId,
        payoutsWithSlotIds.map((payout) => payout.slotId),
        payoutsWithSlotIds.map((payout) => payout.claimDelay),
      ]),
    );

    const tokenAddresses = new Set(
      payoutsWithSlotIds.map((payout) => payout.tokenAddress),
    );

    tokenAddresses.forEach((tokenAddress) => {
      const tokenPayouts = payoutsWithSlotIds.filter(
        (payout) => payout.tokenAddress === tokenAddress,
      );
      const tokenAmounts = tokenPayouts.map((payout) =>
        getPayoutAmount(payout, networkInverseFee),
      );

      multicallData.push(
        colonyClient.interface.encodeFunctionData('setExpenditurePayouts', [
          expenditureId,
          tokenPayouts.map((payout) => payout.slotId),
          tokenAddress,
          tokenAmounts,
        ]),
      );
    });

    yield transactionSetParams(setExpenditureValues.id, [multicallData]);
    yield initiateTransaction(setExpenditureValues.id);
    yield waitForTxResult(setExpenditureValues.channel);

    if (customActionTitle) {
      yield createActionMetadataInDB(txHash, customActionTitle);
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

    setTxHash?.(txHash);

    // @TODO: Remove during advanced payments UI wiring
    // eslint-disable-next-line no-console
    console.log('Created expenditure ID:', expenditureId.toString());
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CREATE_ERROR, error, meta);
  }

  [
    makeExpenditure,
    setExpenditureValues,
    setExpenditureStaged,
    annotateMakeExpenditure,
  ].forEach((channel) => channel.channel.close());

  return null;
}

export default function* createExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CREATE, createExpenditure);
}
