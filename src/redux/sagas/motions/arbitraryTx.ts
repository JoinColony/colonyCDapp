import { ClientType, Id } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

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
  getChildIndexLocal,
} from '../utils/index.ts';

function* arbitraryTxMotion({
  payload: {
    colonyAddress,
    annotationMessage,
    customActionTitle,
    colonyDomains,
    transactions,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_ARBITRARY_TRANSACTION>) {
  let txChannel;
  try {
    const colonyManager: ColonyManager = yield getColonyManager();

    const contractAddresses: string[] = [];
    const methodsBytes: string[] = [];

    transactions.forEach(({ contractAddress, ...item }) => {
      try {
        const encodedFunction = new Interface(item.jsonAbi).encodeFunctionData(
          item.method,
          item.args?.map((arg) => arg.value),
        );
        contractAddresses.push(contractAddress);
        methodsBytes.push(encodedFunction);
      } catch (e) {
        console.error(e);
      }
    });

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const encodedAction = colonyClient.interface.encodeFunctionData(
      'makeArbitraryTransactions',
      [contractAddresses, methodsBytes, true],
    );

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
      type: ActionTypes.MOTION_ARBITRARY_TRANSACTION_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(
      ActionTypes.MOTION_ARBITRARY_TRANSACTION_ERROR,
      caughtError,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

export default function* arbitraryTxMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_ARBITRARY_TRANSACTION, arbitraryTxMotion);
}
