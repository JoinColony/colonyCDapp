import {
  ClientType,
  getChildIndex,
  getPermissionProofs,
  ColonyRole,
  Id,
} from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { TRANSACTION_METHODS } from '~types/transactions.ts';

import { ActionTypes } from '../../actionTypes.ts';
import { type AllActions, type Action } from '../../types/actions/index.ts';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  putError,
  takeFrom,
  updateDomainReputation,
  getColonyManager,
  uploadAnnotation,
  initiateTransaction,
  createActionMetadataInDB,
} from '../utils/index.ts';

export type ManageReputationMotionPayload =
  Action<ActionTypes.MOTION_MANAGE_REPUTATION>['payload'];

function* manageReputationMotion({
  payload: {
    colonyAddress,
    colonyName,
    domainId,
    userAddress,
    amount,
    annotationMessage,
    motionDomainId,
    isSmitingReputation,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_MANAGE_REPUTATION>) {
  let txChannel;
  try {
    /*
     * Validate the required values
     */
    if (!userAddress) {
      throw new Error(
        'A user address is required to manage the reputation of the user',
      );
    }
    if (!domainId) {
      throw new Error(
        'A domain id is required to manage the reputation of the user',
      );
    }
    if (!amount) {
      throw new Error(
        'A reputation amount is required to manage the reputation of the user',
      );
    }

    const context = yield getColonyManager();
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const votingReputationClient = yield context.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient.networkClient,
      colonyClient,
      domainId,
      ColonyRole.Architecture,
      votingReputationClient.address,
    );

    const motionChildSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      isSmitingReputation ? domainId : Id.RootDomain,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion, annotateManageReputationMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateManageReputationMotion',
      ]);

    let encodedAction;

    if (isSmitingReputation) {
      encodedAction = colonyClient.interface.encodeFunctionData(
        'emitDomainReputationPenalty',
        [permissionDomainId, childSkillIndex, domainId, userAddress, amount],
      );
    } else {
      encodedAction = colonyClient.interface.encodeFunctionData(
        'emitDomainReputationReward',
        [domainId, userAddress, amount],
      );
    }

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        motionChildSkillIndex,
        AddressZero,
        encodedAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateManageReputationMotion.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateManageReputationMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction(createMotion.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMotion.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateManageReputationMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);
    /*
     * Refesh the user & colony reputation
     */
    yield fork(updateDomainReputation, {
      colonyAddress,
      walletAddress: userAddress,
      domainId,
    });

    yield put<AllActions>({
      type: ActionTypes.MOTION_MANAGE_REPUTATION_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    yield putError(ActionTypes.MOTION_MANAGE_REPUTATION_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* manageReputationMotionSage() {
  yield takeEvery(ActionTypes.MOTION_MANAGE_REPUTATION, manageReputationMotion);
}
