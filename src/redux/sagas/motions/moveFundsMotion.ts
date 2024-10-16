import { ClientType, Extension, Id } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber, constants } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { CoreAction, getRequiredPermissions } from '~actions';
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
  getPermissionProofsLocal,
  getChildIndexLocal,
} from '../utils/index.ts';

function* moveFundsMotion({
  payload: {
    colonyAddress,
    colonyName,
    colonyVersion,
    fromDomain,
    toDomain,
    amount,
    tokenAddress,
    annotationMessage,
    customActionTitle,
    isMultiSig,
    colonyDomains,
    colonyRoles,
    createdInDomain,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_MOVE_FUNDS>) {
  let txChannel;
  try {
    /*
     * Validate the required values
     */
    if (!fromDomain) {
      throw new Error(
        'Source domain not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!toDomain) {
      throw new Error(
        'Recipient domain not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!amount) {
      throw new Error(
        'Payment amount not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!tokenAddress) {
      throw new Error(
        'Payment token not set for MoveFundsBetweenPots transaction',
      );
    }

    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const userAddress = yield colonyClient.signer.getAddress();

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion, annotateMoveFundsMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateMoveFundsMotion',
      ]);

    // eslint-disable-next-line no-inner-declarations
    function* getCreateMotionParams() {
      const isOldVersion = colonyVersion <= 6;
      const contractMethod = isOldVersion
        ? 'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,address)'
        : 'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)';

      const requiredRoles = getRequiredPermissions(CoreAction.MoveFunds);

      const rootDomain = colonyDomains.find((domain) =>
        BigNumber.from(domain.nativeId).eq(Id.RootDomain),
      );

      if (!rootDomain) {
        throw new Error('Cannot find rootDomain in colony domains');
      }

      const { nativeFundingPotId: fromPot } = fromDomain;
      const { nativeFundingPotId: toPot } = toDomain;

      if (isMultiSig) {
        const multiSigClient = yield colonyClient.getExtensionClient(
          Extension.MultisigPermissions,
        );

        const [multiSigPermissionDomainId, multiSigChildSkillIndex] =
          yield call(getPermissionProofsLocal, {
            networkClient: colonyClient.networkClient,
            colonyRoles,
            colonyDomains,
            requiredDomainId: Id.RootDomain,
            requiredColonyRoles: requiredRoles,
            permissionAddress: multiSigClient.address,
            isMultiSig: false,
          });

        const [userPermissionDomainId, userChildSkillIndex] = yield call(
          getPermissionProofsLocal,
          {
            networkClient: colonyClient.networkClient,
            colonyRoles,
            colonyDomains,
            requiredDomainId: Id.RootDomain,
            requiredColonyRoles: requiredRoles,
            permissionAddress: userAddress,
            isMultiSig: true,
          },
        );

        const fromChildSkillIndex = yield call(getChildIndexLocal, {
          networkClient: colonyClient.networkClient,
          parentDomainNativeId: rootDomain.nativeId,
          parentDomainSkillId: rootDomain.nativeSkillId,
          domainNativeId: fromDomain.nativeId,
          domainSkillId: fromDomain.nativeSkillId,
        });

        const toChildSkillIndex = yield call(getChildIndexLocal, {
          networkClient: colonyClient.networkClient,
          parentDomainNativeId: rootDomain.nativeId,
          parentDomainSkillId: rootDomain.nativeSkillId,
          domainNativeId: toDomain.nativeId,
          domainSkillId: toDomain.nativeSkillId,
        });

        const encodedAction = colonyClient.interface.encodeFunctionData(
          contractMethod,
          [
            ...(isOldVersion
              ? []
              : [multiSigPermissionDomainId, multiSigChildSkillIndex]),
            userPermissionDomainId,
            fromChildSkillIndex,
            toChildSkillIndex,
            fromPot,
            toPot,
            amount,
            tokenAddress,
          ],
        );

        return {
          context: ClientType.MultisigPermissionsClient,
          methodName: 'createMotion',
          identifier: colonyAddress,
          params: [
            userPermissionDomainId,
            userChildSkillIndex,
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

      const votingReputationClient = yield colonyClient.getExtensionClient(
        Extension.VotingReputation,
      );

      const { skillId } = yield call(
        [colonyClient, colonyClient.getDomain],
        createdInDomain.nativeId,
      );

      const { key, value, branchMask, siblings } = yield call(
        colonyClient.getReputation,
        skillId,
        AddressZero,
      );

      const [fromPermissionDomainId, fromChildSkillIndex] = yield call(
        getPermissionProofsLocal,
        {
          networkClient: colonyClient.networkClient,
          colonyRoles,
          colonyDomains,
          requiredDomainId: fromDomain.nativeId,
          requiredColonyRoles: requiredRoles,
          permissionAddress: votingReputationClient.address,
          isMultiSig: false,
        },
      );

      const toChildSkillIndex = yield call(getChildIndexLocal, {
        networkClient: colonyClient.networkClient,
        parentDomainNativeId: rootDomain.nativeId,
        parentDomainSkillId: rootDomain.nativeSkillId,
        domainNativeId: toDomain.nativeId,
        domainSkillId: toDomain.nativeSkillId,
      });

      const motionChildSkillIndex = yield call(getChildIndexLocal, {
        networkClient: colonyClient.networkClient,
        parentDomainNativeId: createdInDomain.nativeId,
        parentDomainSkillId: createdInDomain.nativeSkillId,
        domainNativeId: createdInDomain.nativeId,
        domainSkillId: createdInDomain.nativeSkillId,
      });

      const encodedAction = colonyClient.interface.encodeFunctionData(
        contractMethod,
        [
          ...(isOldVersion
            ? []
            : [fromPermissionDomainId, constants.MaxUint256]),
          fromPermissionDomainId,
          fromChildSkillIndex,
          toChildSkillIndex,
          fromPot,
          toPot,
          amount,
          tokenAddress,
        ],
      );

      return {
        context: ClientType.VotingReputationClient,
        methodName: 'createMotion',
        identifier: colonyAddress,
        params: [
          createdInDomain.nativeId,
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
      };
    }

    const transactionParams = yield getCreateMotionParams();
    // create transactions
    yield fork(createTransaction, createMotion.id, transactionParams);

    if (annotationMessage) {
      yield fork(createTransaction, annotateMoveFundsMotion.id, {
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
        annotateMoveFundsMotion.channel,
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
        txChannel: annotateMoveFundsMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_MOVE_FUNDS_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (caughtError) {
    yield putError(ActionTypes.MOTION_MOVE_FUNDS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* moveFundsMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_MOVE_FUNDS, moveFundsMotion);
}
