import { type AnyColonyClient, ClientType } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context';
import { ExpenditureStatus } from '~gql';
import { transactionAddParams } from '~redux/actionCreators/transactions.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  putError,
  initiateTransaction,
  takeFrom,
  uploadAnnotation,
  getColonyManager,
  getResolvedPayouts,
  getEditDraftExpenditureMulticallData,
  getEditLockedExpenditureMulticallData,
} from '../utils/index.ts';

export type EditExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_EDIT>['payload'];

function* editExpenditureAction({
  payload: {
    colonyAddress,
    expenditure,
    payouts,
    networkInverseFee,
    annotationMessage,
    userAddress,
  },
  meta,
}: Action<ActionTypes.EXPENDITURE_EDIT>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient: AnyColonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const batchKey = 'createExpenditure';

  const resolvedPayouts = getResolvedPayouts(payouts, expenditure);

  const {
    editExpenditure,
    annotateEditExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['editExpenditure', 'annotateEditExpenditure'],
  );

  try {
    yield fork(createTransaction, editExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateEditExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(editExpenditure.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateEditExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    if (
      expenditure.ownerAddress === userAddress &&
      expenditure.status === ExpenditureStatus.Draft
    ) {
      const multicallData = yield getEditDraftExpenditureMulticallData(
        expenditure.nativeId,
        resolvedPayouts,
        colonyClient,
        networkInverseFee,
      );

      yield put(transactionAddParams(editExpenditure.id, [multicallData]));
    } else {
      const multicallData = yield getEditLockedExpenditureMulticallData(
        expenditure,
        resolvedPayouts,
        colonyClient,
        networkInverseFee,
      );

      yield put(transactionAddParams(editExpenditure.id, [multicallData]));
    }

    yield initiateTransaction({ id: editExpenditure.id });

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(editExpenditure.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateEditExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_EDIT_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_EDIT_ERROR, error, meta);
  }

  [editExpenditure, annotateEditExpenditure].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* editExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_EDIT, editExpenditureAction);
}
