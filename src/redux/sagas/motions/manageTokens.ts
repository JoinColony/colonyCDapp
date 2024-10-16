import { ClientType, Id } from '@colony/colony-js';
import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { CoreAction, getRequiredPermissions } from '~actions';
import { ADDRESS_ZERO } from '~constants';
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
  getPermissionProofsLocal,
  getChildIndexLocal,
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
    colonyRoles,
    colonyDomains,
    isMultiSig = false,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_MANAGE_TOKENS>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion, annotateManageTokensMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateManageTokensMotion',
      ]);

    yield validateTokenAddresses({ tokenAddresses });

    const colonyManager: ColonyManager = yield getColonyManager();

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const encodedAction = colonyClient.interface.encodeFunctionData(
      TRANSACTION_METHODS.EditColonyByDelta,
      [JSON.stringify(getManageTokensOperation(tokenAddresses))],
    );

    // eslint-disable-next-line no-inner-declarations
    function* getCreateMotionParams() {
      if (isMultiSig) {
        const initiatorAddress = yield colonyClient.signer.getAddress();

        // Permission proofs for the user creating the multi-sig motion
        const [, childSkillIndex] = yield call(getPermissionProofsLocal, {
          networkClient: colonyClient.networkClient,
          colonyRoles,
          colonyDomains,
          requiredDomainId: Id.RootDomain,
          requiredColonyRoles: getRequiredPermissions(CoreAction.ManageTokens),
          // The address of the user creating the multi-sig motion
          permissionAddress: initiatorAddress,
          // The user must have multi-sig permissions
          isMultiSig: true,
        });

        return {
          context: ClientType.MultisigPermissionsClient,
          methodName: TRANSACTION_METHODS.CreateMotion,
          identifier: colonyAddress,
          params: [
            Id.RootDomain,
            childSkillIndex,
            [ADDRESS_ZERO],
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
      };
    }

    const transactionParams = yield getCreateMotionParams();
    // create transactions
    yield fork(createTransaction, createMotion.id, transactionParams);

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
