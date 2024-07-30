import { ClientType, Id, getChildIndex } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
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
  getColonyManager,
  uploadAnnotation,
  initiateTransaction,
  createActionMetadataInDB,
} from '../utils/index.ts';
import { getManageTokensOperation } from '../utils/metadataDelta.ts';
import { validateTokenAddresses } from '../utils/validateTokens.ts';

function* manageTokensMotion({
  payload: {
    colonyAddress,
    colonyName,
    tokenAddresses,
    customActionTitle,
    annotationMessage,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_MANAGE_TOKENS>) {
  let txChannel;
  try {
    const colonyManager: ColonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      Id.RootDomain,
      Id.RootDomain,
    );

    yield validateTokenAddresses({ tokenAddresses });

    const encodedAction = colonyClient.interface.encodeFunctionData(
      TRANSACTION_METHODS.EditColonyByDelta,
      [JSON.stringify(getManageTokensOperation(tokenAddresses))],
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      Id.RootDomain,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion, annotateManageTokensMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateManageTokensMotion',
      ]);

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: TRANSACTION_METHODS.CreateMotion,
      identifier: colonyAddress,
      params: [
        Id.RootDomain,
        childSkillIndex,
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
      yield fork(createTransaction, annotateManageTokensMotion.id, {
        context: ClientType.ColonyClient,
        methodName: TRANSACTION_METHODS.AnnotateTransaction,
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
        annotateManageTokensMotion.channel,
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
        txChannel: annotateManageTokensMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);
    yield put<AllActions>({
      type: ActionTypes.MOTION_MANAGE_TOKENS_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    yield putError(ActionTypes.MOTION_MANAGE_TOKENS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* manageTokensMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_MANAGE_TOKENS, manageTokensMotion);
}
