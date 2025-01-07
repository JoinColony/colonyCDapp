import { ClientType, Id } from '@colony/colony-js';
import { type CustomContract } from '@colony/sdk';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { colonyAbi } from '~constants/abis.ts';
import { type ColonyManager } from '~context/index.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import {
  putError,
  takeFrom,
  getColonyManager,
  uploadAnnotation,
  initiateTransaction,
  createActionMetadataInDB,
  getChildIndexLocal,
} from '~redux/sagas/utils/index.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

function* createProxyColonyMotionSaga({
  payload: {
    colonyAddress,
    creationSalt,
    foreignChainId,
    customActionTitle,
    annotationMessage,
    colonyDomains,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_PROXY_COLONY_CREATE>) {
  let txChannel;
  try {
    const colonyManager: ColonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const proxyColonyContract: CustomContract<typeof colonyAbi> =
      colonyManager.getCustomContract(colonyAddress, colonyAbi);

    const encodedAction = yield proxyColonyContract
      .createTxCreator('createProxyColony', [
        BigInt(foreignChainId),
        creationSalt,
      ] as any)
      .tx()
      .encode();

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion, annotateRootMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateRootMotion',
      ]);

    // eslint-disable-next-line no-inner-declarations
    function* getCreateMotionParams() {
      const rootDomain = colonyDomains.find((domain) =>
        BigNumber.from(domain.nativeId).eq(Id.RootDomain),
      );

      if (!rootDomain) {
        throw new Error('Cannot find rootDomain in colony domains');
      }

      const childSkillIndex = yield call(getChildIndexLocal, {
        networkClient: colonyClient.networkClient,
        parentDomainNativeId: rootDomain.nativeId,
        parentDomainSkillId: rootDomain.nativeSkillId,
        domainNativeId: rootDomain.nativeId,
        domainSkillId: rootDomain.nativeSkillId,
      });
      const { skillId } = yield call(
        [colonyClient, colonyClient.getDomain],
        Id.RootDomain,
      );

      const { key, value, branchMask, siblings } = yield call(
        colonyClient.getReputation,
        skillId,
        AddressZero,
      );

      return {
        context: ClientType.VotingReputationClient,
        methodName: 'createMotion',
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
      };
    }

    const transactionParams = yield getCreateMotionParams();
    // create transactions
    yield fork(createTransaction, createMotion.id, transactionParams);

    if (annotationMessage) {
      yield fork(createTransaction, annotateRootMotion.id, {
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
        annotateRootMotion.channel,
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
        txChannel: annotateRootMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_PROXY_COLONY_CREATE_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(
      ActionTypes.MOTION_PROXY_COLONY_CREATE_ERROR,
      caughtError,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

export default function* createProxyColonyMotion() {
  yield takeEvery(
    ActionTypes.MOTION_PROXY_COLONY_CREATE,
    createProxyColonyMotionSaga,
  );
}
