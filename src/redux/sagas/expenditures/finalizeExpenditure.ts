import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import type ColonyManager from '~context/ColonyManager.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { type Address } from '~types';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  type TransactionChannel,
} from '../transactions/index.ts';
import {
  getColonyManager,
  claimExpenditurePayouts,
  getImmediatelyClaimableSlots,
  getPayoutsWithSlotIdsFromSlots,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

export type FinalizeExpenditurePayload =
  Action<ActionTypes.EXPENDITURE_FINALIZE>['payload'];

function* finalizeExpenditureAction({
  payload: { colonyAddress, expenditure, userAddress },
  meta,
}: Action<ActionTypes.EXPENDITURE_FINALIZE>) {
  const batchKey = 'finalizeExpenditure';
  const { nativeId: expenditureId, nativeDomainId: expenditureDomainId } =
    expenditure;

  const {
    finalizeExpenditure,
    annotateFinalizeExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['finalizeExpenditure', 'annotateFinalizeExpenditure'],
  );

  try {
    if (expenditure.ownerAddress === userAddress) {
      yield finalizeExpenditureAsOwner({
        batchKey,
        colonyAddress,
        expenditureId,
        finalizeExpenditure,
        metaId: meta.id,
      });
    } else {
      yield finalizeExpenditureWithPermissions({
        batchKey,
        colonyAddress,
        expenditureId,
        expenditureDomainId,
        finalizeExpenditure,
        metaId: meta.id,
      });
    }
    const claimableSlots = getImmediatelyClaimableSlots(expenditure.slots);

    yield claimExpenditurePayouts({
      colonyAddress,
      claimablePayouts: getPayoutsWithSlotIdsFromSlots(claimableSlots),
      metaId: meta.id,
      nativeExpenditureId: expenditure.nativeId,
    });

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

type FinalizeExpenditureAsOwnerParams = {
  finalizeExpenditure: TransactionChannel;
  colonyAddress: Address;
  expenditureId: number;
  metaId: string;
  batchKey: string;
};

function* finalizeExpenditureAsOwner({
  batchKey,
  colonyAddress,
  expenditureId,
  finalizeExpenditure,
  metaId,
}: FinalizeExpenditureAsOwnerParams) {
  yield fork(createTransaction, finalizeExpenditure.id, {
    context: ClientType.ColonyClient,
    methodName: 'finalizeExpenditure',
    identifier: colonyAddress,
    params: [expenditureId],
    group: {
      key: batchKey,
      id: metaId,
      index: 0,
    },
  });

  yield takeFrom(finalizeExpenditure.channel, ActionTypes.TRANSACTION_CREATED);
  yield initiateTransaction({ id: finalizeExpenditure.id });
}

interface FinalizeExpenditureWithPermissions
  extends FinalizeExpenditureAsOwnerParams {
  expenditureDomainId: number;
}

function* finalizeExpenditureWithPermissions({
  batchKey,
  colonyAddress,
  expenditureId,
  expenditureDomainId,
  finalizeExpenditure,
  metaId,
}: FinalizeExpenditureWithPermissions) {
  const colonyManager: ColonyManager = yield getColonyManager();

  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
    colonyClient.networkClient,
    colonyClient,
    expenditureDomainId,
    ColonyRole.Arbitration,
  );

  const params = [permissionDomainId, childSkillIndex, expenditureId];

  yield fork(createTransaction, finalizeExpenditure.id, {
    context: ClientType.ColonyClient,
    methodName: 'finalizeExpenditureViaArbitration',
    identifier: colonyAddress,
    params,
    group: {
      key: batchKey,
      id: metaId,
      index: 0,
    },
  });
  yield takeFrom(finalizeExpenditure.channel, ActionTypes.TRANSACTION_CREATED);
  yield initiateTransaction({ id: finalizeExpenditure.id });
}

export default function* finalizeExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FINALIZE, finalizeExpenditureAction);
}
