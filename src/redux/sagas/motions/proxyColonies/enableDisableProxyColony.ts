import { ClientType, Id } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

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
import {
  getDisableProxyColonyOperation,
  getEnableProxyColonyOperation,
} from '~redux/sagas/utils/metadataDelta.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { ManageEntityOperation } from '~v5/common/ActionSidebar/consts.ts';

function* enableDisableProxyColonyMotionSaga({
  payload: {
    colonyAddress,
    foreignChainId,
    customActionTitle,
    annotationMessage,
    colonyDomains,
    operation,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_PROXY_COLONY_ENABLE_DISABLE>) {
  let txChannel;

  const isEnableOperation = operation === ManageEntityOperation.Add;

  try {
    const colonyManager: ColonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const editColonyByDeltaOperation = isEnableOperation
      ? getEnableProxyColonyOperation
      : getDisableProxyColonyOperation;

    const encodedAction = colonyClient.interface.encodeFunctionData(
      TRANSACTION_METHODS.EditColonyByDelta,
      [JSON.stringify(editColonyByDeltaOperation([foreignChainId.toString()]))],
    );

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { manageProxyColonyMotion, annotateManageProxyColonyMotion } =
      yield createTransactionChannels(metaId, [
        'manageProxyColonyMotion',
        'annotateManageProxyColonyMotion',
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

    yield fork(
      createTransaction,
      manageProxyColonyMotion.id,
      transactionParams,
    );

    if (annotationMessage) {
      yield fork(createTransaction, annotateManageProxyColonyMotion.id, {
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

    yield takeFrom(
      manageProxyColonyMotion.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        annotateManageProxyColonyMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction(manageProxyColonyMotion.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(manageProxyColonyMotion.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateManageProxyColonyMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_PROXY_COLONY_ENABLE_DISABLE_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(
      ActionTypes.MOTION_PROXY_COLONY_ENABLE_DISABLE_ERROR,
      caughtError,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

export default function* createProxyColonyMotion() {
  yield takeEvery(
    ActionTypes.MOTION_PROXY_COLONY_ENABLE_DISABLE,
    enableDisableProxyColonyMotionSaga,
  );
}
