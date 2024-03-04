/* eslint-disable @typescript-eslint/no-unused-vars */
import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import type ColonyManager from '~context/ColonyManager.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { type Address } from '~types';
import { type Expenditure } from '~types/graphql.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  getDataForFinalizeExpenditure,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

export type FinalizeExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_FINALIZE>['payload'];

function* finalizeExpenditureAction({
  payload: { colonyAddress, expenditure, userAddress, annotationMessage },
  meta,
}: Action<ActionTypes.EXPENDITURE_FINALIZE>) {
  if (expenditure.ownerAddress === userAddress) {
    yield finalizeExpenditureAsOwner({
      colonyAddress,
      expenditure,
      annotationMessage,
      meta,
    });
  } else {
    yield finalizeExpenditureWithPermissions({
      colonyAddress,
      expenditure,
      annotationMessage,
      meta,
      userAddress,
    });
  }
}

type FinalizeExpenditureAsOwnerParams = {
  colonyAddress: Address;
  expenditure: Expenditure;
  meta: Action<ActionTypes.EXPENDITURE_FINALIZE>['meta'];
  annotationMessage?: string;
};

function* finalizeExpenditureAsOwner({
  colonyAddress,
  expenditure,
  meta,
  annotationMessage,
}: FinalizeExpenditureAsOwnerParams) {
  const batchKey = 'finalizeExpenditure';
  const { nativeId } = expenditure;

  const {
    finalizeExpenditure,
    annotateFinalizeExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['finalizeExpenditure', 'annotateFinalizeExpenditure'],
  );

  try {
    yield fork(createTransaction, finalizeExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'finalizeExpenditure',
      identifier: colonyAddress,
      params: [nativeId],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateFinalizeExpenditure.id, {
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

    yield takeFrom(
      finalizeExpenditure.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        annotateFinalizeExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: finalizeExpenditure.id });
    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      finalizeExpenditure.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield waitForTxResult(finalizeExpenditure.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateFinalizeExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_FINALIZE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.EXPENDITURE_FINALIZE_ERROR, error, meta);
  }
  [finalizeExpenditure, annotateFinalizeExpenditure].forEach((channel) =>
    channel.channel.close(),
  );
}

type FinalizeExpenditureWithPermissions = {
  colonyAddress: Address;
  expenditure: Expenditure;
  meta: Action<ActionTypes.EXPENDITURE_FINALIZE>['meta'];
  annotationMessage?: string;
  userAddress: Address;
};

function* finalizeExpenditureWithPermissions({
  colonyAddress,
  expenditure,
  meta,
  annotationMessage,
  userAddress,
}: FinalizeExpenditureWithPermissions) {
  const batchKey = 'finalizeExpenditure';
  const colonyManager: ColonyManager = yield getColonyManager();
  const {
    finalizeExpenditure,
    annotateFinalizeExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['finalizeExpenditure', 'annotateFinalizeExpenditure'],
  );

  try {
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const params = yield getDataForFinalizeExpenditure(
      expenditure,
      colonyClient,
      userAddress,
    );

    yield fork(createTransaction, finalizeExpenditure.id, {
      context: ClientType.ColonyClient,
      methodName: 'setExpenditureState',
      identifier: colonyAddress,
      params,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateFinalizeExpenditure.id, {
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

    yield takeFrom(
      finalizeExpenditure.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        annotateFinalizeExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: finalizeExpenditure.id });

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(finalizeExpenditure.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateFinalizeExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.EXPENDITURE_FINALIZE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.EXPENDITURE_FINALIZE_ERROR, error, meta);
  }
  [finalizeExpenditure, annotateFinalizeExpenditure].forEach((channel) =>
    channel.channel.close(),
  );
}

export default function* finalizeExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FINALIZE, finalizeExpenditureAction);
}
