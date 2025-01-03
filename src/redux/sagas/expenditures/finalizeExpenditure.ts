import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import type ColonyManager from '~context/ColonyManager.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import {
  getClaimableExpenditurePayouts,
  getExpenditureCreatingActionId,
} from '~utils/expenditures.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  claimExpenditurePayouts,
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
    const colonyManager: ColonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    if (expenditure.ownerAddress === userAddress) {
      yield fork(createTransaction, finalizeExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'finalizeExpenditure',
        identifier: colonyAddress,
        params: [expenditureId],
        group: {
          key: batchKey,
          id: meta.id,
          index: 0,
        },
        associatedActionId: getExpenditureCreatingActionId(expenditure),
      });
    } else {
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
          id: meta.id,
          index: 0,
        },
        associatedActionId: getExpenditureCreatingActionId(expenditure),
      });
    }

    yield takeFrom(
      finalizeExpenditure.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    yield initiateTransaction(finalizeExpenditure.id);
    yield waitForTxResult(finalizeExpenditure.channel);

    const claimablePayouts = getClaimableExpenditurePayouts(expenditure.slots);

    yield claimExpenditurePayouts({
      colonyAddress,
      claimablePayouts,
      metaId: meta.id,
      nativeExpenditureId: expenditure.nativeId,
      colonyClient,
      associatedActionId: getExpenditureCreatingActionId(expenditure),
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

export default function* finalizeExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_FINALIZE, finalizeExpenditureAction);
}
