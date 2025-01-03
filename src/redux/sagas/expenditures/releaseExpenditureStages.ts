import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { ExpenditureStatus } from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action, type AllActions } from '~redux/types/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { getExpenditureCreatingActionId } from '~utils/expenditures.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils/index.ts';

export type ReleaseExpenditureStagesPayload =
  Action<ActionTypes.RELEASE_EXPENDITURE_STAGES>['payload'];

function* releaseExpenditureStages({
  payload: {
    colonyAddress,
    expenditure,
    slotIds,
    tokenAddresses,
    stagedExpenditureAddress,
    annotationMessage,
    userAddress,
  },
  meta,
}: Action<ActionTypes.RELEASE_EXPENDITURE_STAGES>) {
  const batchKey = TRANSACTION_METHODS.ReleaseExpenditure;

  const {
    releaseExpenditure,
    annotateReleaseExpenditure,
  }: Record<string, ChannelDefinition> = yield createTransactionChannels(
    meta.id,
    ['releaseExpenditure', 'annotateReleaseExpenditure'],
  );

  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  try {
    if (expenditure.status !== ExpenditureStatus.Finalized) {
      throw new Error(
        'Expenditure must be finalized in order to release expenditure stage',
      );
    }

    const stagedExpenditureClient = yield colonyManager.getClient(
      ClientType.StagedExpenditureClient,
      colonyAddress,
    );

    const [extensionPermissionDomainId, extensionChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        expenditure.nativeDomainId,
        ColonyRole.Arbitration,
        stagedExpenditureAddress,
      );

    let userPermissionDomainId;
    let userChildSkillIndex;
    if (expenditure.ownerAddress !== userAddress) {
      [userPermissionDomainId, userChildSkillIndex] = yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        expenditure.nativeDomainId,
        ColonyRole.Arbitration,
      );
    }

    const multicallData: string[] = [];
    slotIds.forEach((slotId) => {
      let functionData;
      if (expenditure.ownerAddress === userAddress) {
        functionData = stagedExpenditureClient.interface.encodeFunctionData(
          'releaseStagedPayment',
          [
            extensionPermissionDomainId,
            extensionChildSkillIndex,
            expenditure.nativeId,
            slotId,
            tokenAddresses,
          ],
        );
      } else {
        functionData = stagedExpenditureClient.interface.encodeFunctionData(
          'releaseStagedPaymentViaArbitration',
          [
            userPermissionDomainId,
            userChildSkillIndex,
            extensionPermissionDomainId,
            extensionChildSkillIndex,
            expenditure.nativeId,
            slotId,
            tokenAddresses,
          ],
        );
      }

      multicallData.push(functionData);
    });

    yield fork(createTransaction, releaseExpenditure.id, {
      context: ClientType.StagedExpenditureClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
      params: [multicallData],
      associatedActionId: getExpenditureCreatingActionId(expenditure),
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateReleaseExpenditure.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 1,
        },
        ready: false,
        associatedActionId: getExpenditureCreatingActionId(expenditure),
      });
    }

    yield takeFrom(releaseExpenditure.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateReleaseExpenditure.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction(releaseExpenditure.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(releaseExpenditure.channel);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateReleaseExpenditure,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.RELEASE_EXPENDITURE_STAGES_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.RELEASE_EXPENDITURE_STAGES_ERROR,
      error,
      meta,
    );
  }
  [releaseExpenditure, annotateReleaseExpenditure].forEach((channel) =>
    channel.channel.close(),
  );

  return null;
}

export default function* releaseExpenditureStageSaga() {
  yield takeEvery(
    ActionTypes.RELEASE_EXPENDITURE_STAGES,
    releaseExpenditureStages,
  );
}
