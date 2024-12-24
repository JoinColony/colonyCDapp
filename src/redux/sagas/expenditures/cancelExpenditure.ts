import {
  type AnyColonyClient,
  ClientType,
  ColonyRole,
  getPermissionProofs,
} from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { ExpenditureStatus } from '~gql';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { type Expenditure } from '~types/graphql.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
} from '../utils/index.ts';

export type CancelExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_CANCEL>['payload'];

function* cancelExpenditure({
  meta,
  payload: {
    colonyAddress,
    expenditure,
    stakedExpenditureAddress,
    userAddress,
  },
}: Action<ActionTypes.EXPENDITURE_CANCEL>) {
  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const txChannel = yield call(getTxChannel, meta.id);

  try {
    if (
      expenditure.status === ExpenditureStatus.Draft &&
      expenditure.ownerAddress === userAddress
    ) {
      yield cancelDraftExpenditure({
        expenditure,
        colonyAddress,
        colonyClient,
        stakedExpenditureAddress,
        meta,
      });
    } else {
      yield cancelLockedExpenditure({
        expenditure,
        colonyAddress,
        colonyClient,
        meta,
      });
    }

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.EXPENDITURE_CANCEL_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_CANCEL_ERROR, error, meta);
  }

  txChannel.close();
  return null;
}

type CancelExpenditureHelperParam = {
  colonyAddress: string;
  expenditure: Expenditure;
  colonyClient: AnyColonyClient;
  meta: Action<ActionTypes.EXPENDITURE_CANCEL>['meta'];
  stakedExpenditureAddress?: string;
};

function* cancelDraftExpenditure({
  expenditure,
  colonyClient,
  colonyAddress,
  stakedExpenditureAddress,
  meta,
}: CancelExpenditureHelperParam) {
  const batchKey = TRANSACTION_METHODS.CancelDraftExpenditure;

  if (expenditure.isStaked && stakedExpenditureAddress) {
    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      expenditure.nativeDomainId,
      ColonyRole.Arbitration,
      stakedExpenditureAddress,
    );

    yield fork(createTransaction, meta.id, {
      context: ClientType.StakedExpenditureClient,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      methodName: 'cancelAndReclaimStake',
      identifier: colonyAddress,
      params: [permissionDomainId, childSkillIndex, expenditure.nativeId],
      associatedActionId:
        expenditure.creatingActions?.items[0]?.transactionHash,
    });
  } else {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      methodName: 'cancelExpenditure',
      identifier: colonyAddress,
      params: [expenditure.nativeId],
      associatedActionId:
        expenditure.creatingActions?.items[0]?.transactionHash,
    });
  }

  yield initiateTransaction(meta.id);
}

function* cancelLockedExpenditure({
  meta,
  colonyAddress,
  colonyClient,
  expenditure,
}: CancelExpenditureHelperParam) {
  const batchKey = TRANSACTION_METHODS.CancelLockedExpenditure;

  const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
    colonyClient.networkClient,
    colonyClient,
    expenditure.nativeDomainId,
    ColonyRole.Arbitration,
  );

  const params = [permissionDomainId, childSkillIndex, expenditure.nativeId];

  yield fork(createTransaction, meta.id, {
    context: ClientType.ColonyClient,
    group: {
      key: batchKey,
      id: meta.id,
      index: 0,
    },
    methodName: 'cancelExpenditureViaArbitration',
    identifier: colonyAddress,
    params,
    associatedActionId: expenditure.creatingActions?.items[0]?.transactionHash,
  });

  yield initiateTransaction(meta.id);
}

export default function* cancelExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_CANCEL, cancelExpenditure);
}
