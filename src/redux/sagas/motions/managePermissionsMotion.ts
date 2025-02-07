import { ClientType, Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { hexlify, hexZeroPad } from 'ethers/lib/utils';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { PERMISSIONS_NEEDED_FOR_ACTION } from '~constants/actions.ts';
import { ADDRESS_ZERO } from '~constants/index.ts';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { Authority } from '~types/authority.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  uploadAnnotation,
  createActionMetadataInDB,
  getPermissionProofsLocal,
  getChildIndexLocal,
  putError,
  takeFrom,
} from '../utils/index.ts';

function* managePermissionsMotion({
  payload: {
    colonyAddress,
    domainId: teamDomainId,
    userAddress,
    roles,
    authority,
    annotationMessage,
    customActionTitle,
    motionDomainId: createdInDomainId,
    colonyRoles,
    colonyDomains,
    // Is using the multi-sig decision method
    isMultiSig = false,
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_USER_ROLES_SET>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion, annotateSetUserRolesMotion } =
      yield createTransactionChannels(metaId, [
        'createMotion',
        'annotateSetUserRolesMotion',
      ]);

    // eslint-disable-next-line no-inner-declarations
    function* getCreateMotionParams() {
      const colonyManager = yield getColonyManager();

      const colonyClient = yield colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );

      const createdInDomain = colonyDomains.find((domain) =>
        BigNumber.from(domain.nativeId).eq(createdInDomainId),
      );
      const teamDomain = colonyDomains.find((domain) =>
        BigNumber.from(domain.nativeId).eq(teamDomainId),
      );

      if (!createdInDomain || !teamDomain) {
        throw new Error(
          'Cannot find created in domain or team domain in colony domains',
        );
      }

      const roleArray = Object.values(roles).reverse();
      roleArray.splice(2, 0, false);

      let roleBitmask = '';

      roleArray.forEach((role) => {
        roleBitmask += role ? '1' : '0';
      });

      const hexString = hexlify(parseInt(roleBitmask, 2));
      const zeroPadHexString = hexZeroPad(hexString, 32);

      let altTarget: string;

      switch (authority) {
        case Authority.ViaMultiSig: {
          const multiSigClient = yield colonyManager.getClient(
            ClientType.MultisigPermissionsClient,
            colonyAddress,
          );
          // If assigning the user MultiSig permissions, then pass the multi-sig client address
          altTarget = multiSigClient.address;
          break;
        }
        case Authority.Own:
        default: {
          // If assigning the user own permissions and is not multi-sig, then pass address zero
          altTarget = ADDRESS_ZERO;
          break;
        }
      }

      if (isMultiSig) {
        // Creating a multi-sig motion
        const requiredCreatedInRoles =
          teamDomainId === Id.RootDomain
            ? PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain
            : PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomainViaMultiSig;

        const initiatorAddress = yield colonyClient.signer.getAddress();

        const multiSigClient = yield colonyManager.getClient(
          ClientType.MultisigPermissionsClient,
          colonyAddress,
        );

        // Get permission proofs for encoding the action with the multi-sig extension which will be used to execute the action
        const [multiSigPermissionDomainId, multiSigChildSkillIndex] =
          yield call(getPermissionProofsLocal, {
            networkClient: colonyClient.networkClient,
            colonyRoles,
            colonyDomains,
            requiredDomainId: teamDomainId,
            requiredColonyRoles: requiredCreatedInRoles,
            // The address of the multi-sig client
            permissionAddress: multiSigClient.address,
            // The multi-sig extension has regular permissions, not multi-sig permissions
            isMultiSig: false,
          });

        const encodedAction = colonyClient.interface.encodeFunctionData(
          'setUserRoles',
          [
            multiSigPermissionDomainId,
            multiSigChildSkillIndex,
            // The address of the user being assigned permissions
            userAddress,
            // The domain they are being assigned permissions in
            teamDomainId,
            // A hex string representing the roles they are being assigned
            zeroPadHexString,
          ],
        );

        // Permission proofs for the user creating the multi-sig motion
        const [userPermissionDomainId, userChildSkillIndex] = yield call(
          getPermissionProofsLocal,
          {
            networkClient: colonyClient.networkClient,
            colonyRoles,
            colonyDomains,
            requiredDomainId: teamDomainId,
            requiredColonyRoles: requiredCreatedInRoles,
            // The address of the user creating the multi-sig motion
            permissionAddress: initiatorAddress,
            // The user must have multi-sig permissions
            isMultiSig: true,
          },
        );

        const params = [
          userPermissionDomainId,
          userChildSkillIndex,
          [altTarget],
          [encodedAction],
        ];

        return {
          context: ClientType.MultisigPermissionsClient,
          methodName: TRANSACTION_METHODS.CreateMotion,
          identifier: colonyAddress,
          params,
          group: {
            key: batchKey,
            id: metaId,
            index: 0,
          },
          ready: false,
        };
      }

      // Creating a reputation motion
      const requiredTeamRoles =
        teamDomainId === Id.RootDomain
          ? PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInRootDomain
          : PERMISSIONS_NEEDED_FOR_ACTION.ManagePermissionsInSubDomain;

      const votingReputationClient = yield colonyManager.getClient(
        ClientType.VotingReputationClient,
        colonyAddress,
      );

      // Get permission proofs for encoding the action with the voting reputation extension which will be used to execute the action
      const [
        votingReputationPermissionDomainId,
        votingReputationChildSkillIndex,
      ] = yield call(getPermissionProofsLocal, {
        networkClient: colonyClient.networkClient,
        colonyRoles,
        colonyDomains,
        // The domain they are being assigned permissions in
        requiredDomainId: teamDomainId,
        requiredColonyRoles: requiredTeamRoles,
        // The address of the voting reputation client
        permissionAddress: votingReputationClient.address,
        isMultiSig: false,
      });

      const encodedAction = colonyClient.interface.encodeFunctionData(
        'setUserRoles',
        [
          votingReputationPermissionDomainId,
          votingReputationChildSkillIndex,
          // The address of the user being assigned permissions
          userAddress,
          // The domain they are being assigned permissions in
          teamDomainId,
          // A hex string representing the roles they are being assigned
          zeroPadHexString,
        ],
      );

      const motionChildSkillIndex = yield call(getChildIndexLocal, {
        networkClient: colonyClient.networkClient,
        parentDomainNativeId: createdInDomain.nativeId,
        parentDomainSkillId: createdInDomain.nativeSkillId,
        domainNativeId: teamDomain.nativeId,
        domainSkillId: teamDomain.nativeSkillId,
      });

      const { skillId } = yield call(
        [colonyClient, colonyClient.getDomain],
        createdInDomainId,
      );

      const { key, value, branchMask, siblings } = yield call(
        colonyClient.getReputation,
        skillId,
        ADDRESS_ZERO,
      );

      return {
        context: ClientType.VotingReputationClient,
        methodName: TRANSACTION_METHODS.CreateMotion,
        identifier: colonyAddress,
        params: [
          createdInDomainId,
          motionChildSkillIndex,
          altTarget,
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

    yield fork(createTransaction, createMotion.id, transactionParams);

    if (annotationMessage) {
      yield fork(createTransaction, annotateSetUserRolesMotion.id, {
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
        annotateSetUserRolesMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield initiateTransaction(createMotion.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMotion.channel);

    yield createActionMetadataInDB(txHash, { customTitle: customActionTitle });

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateSetUserRolesMotion,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_USER_ROLES_SET_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    yield putError(ActionTypes.MOTION_USER_ROLES_SET_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* managePermissionsMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_USER_ROLES_SET, managePermissionsMotion);
}
