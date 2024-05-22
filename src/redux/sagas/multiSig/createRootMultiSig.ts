import {
  ClientType,
  ColonyRole,
  Id,
  getPermissionProofs,
} from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';

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

function* createRootMultiSigSaga({
  payload: {
    operationName,
    colonyAddress,
    colonyName,
    multiSigParams,
    annotationMessage,
    customActionTitle,
    domainId = Id.RootDomain,
    requiredRole = ColonyRole.Root,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ROOT_MULTISIG>) {
  let txChannel;

  try {
    if (!multiSigParams) {
      throw new Error('Parameters not set for rootMultiSig transaction');
    }

    const colonyManager: ColonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      domainId,
      requiredRole,
    );

    const encodedAction = colonyClient.interface.encodeFunctionData(
      operationName,
      multiSigParams,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createMultiSig';

    const { createMultiSig, annotateRootMultiSig } =
      yield createTransactionChannels(metaId, [
        'createMultiSig',
        'annotateRootMultiSig',
      ]);

    // create transactions
    yield fork(createTransaction, createMultiSig.id, {
      context: ClientType.MultisigPermissionsClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [Id.RootDomain, childSkillIndex, [AddressZero], [encodedAction]],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateRootMultiSig.id, {
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

    yield takeFrom(createMultiSig.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateRootMultiSig.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction({ id: createMultiSig.id });

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMultiSig.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateRootMultiSig,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);
    yield put<AllActions>({
      type: ActionTypes.ROOT_MULTISIG_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    yield putError(ActionTypes.ROOT_MULTISIG_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* rootMultiSigSaga() {
  yield takeEvery(ActionTypes.ROOT_MULTISIG, createRootMultiSigSaga);
}
