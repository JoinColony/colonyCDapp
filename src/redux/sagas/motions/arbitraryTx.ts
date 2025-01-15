import { ClientType, Id } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber, utils } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
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
import { encodeArbitraryTransactions } from '../utils/arbitraryTxs.ts';
import {
  putError,
  takeFrom,
  getColonyManager,
  uploadAnnotation,
  initiateTransaction,
  createActionMetadataInDB,
  getPermissionProofsLocal,
  getChildIndexLocal,
} from '../utils/index.ts';

function* arbitraryTxMotion({
  payload: {
    colonyAddress,
    annotationMessage,
    customActionTitle,
    colonyRoles,
    colonyDomains,
    transactions,
    isMultiSig = false,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_ARBITRARY_TRANSACTION>) {
  let txChannel;
  try {
    const colonyManager: ColonyManager = yield getColonyManager();

    const { contractAddresses, methodsBytes } =
      encodeArbitraryTransactions(transactions);

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const userAddress = yield colonyClient.signer.getAddress();

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
      if (isMultiSig) {
        const [, childSkillIndex] = yield call(getPermissionProofsLocal, {
          networkClient: colonyClient.networkClient,
          colonyRoles,
          colonyDomains,
          requiredDomainId: Id.RootDomain,
          requiredColonyRoles: PERMISSIONS_NEEDED_FOR_ACTION.ArbitraryTxs,
          permissionAddress: userAddress,
          isMultiSig: true,
        });

        return {
          context: ClientType.MultisigPermissionsClient,
          methodName: 'createMotion',
          identifier: colonyAddress,
          params: [
            Id.RootDomain,
            childSkillIndex,
            [AddressZero],
            [encodedAction],
          ],
          group: {
            key: batchKey,
            id: metaId,
            index: 0,
          },
          ready: false,
        };
      }

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

    const abisByAddress = transactions.reduce<Record<string, string>>(
      (acc, transaction) => {
        const checksummedAddress = utils.getAddress(
          transaction.contractAddress,
        );
        acc[checksummedAddress] = transaction.jsonAbi;
        return acc;
      },
      {},
    );
    const arbitraryTxAbis = Object.entries(abisByAddress).map(
      ([contractAddress, jsonAbi]) => ({
        contractAddress,
        jsonAbi,
      }),
    );

    yield createActionMetadataInDB(txHash, {
      customTitle: customActionTitle,
      arbitraryTxAbis,
    });

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
