import {
  ClientType,
  ColonyRole,
  getPermissionProofs,
  Id,
} from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { type ColonyManager } from '~context/index.ts';
import { transactionSetParams } from '~state/transactionState.ts';
import { Authority } from '~types/authority.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { intArrayToBytes32 } from '~utils/web3/index.ts';

import { transactionPending } from '../../actionCreators/index.ts';
import { ActionTypes } from '../../actionTypes.ts';
import { type AllActions, type Action } from '../../types/actions/index.ts';
import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
  getColonyManager,
  createActionMetadataInDB,
} from '../utils/index.ts';

function* managePermissionsAction({
  payload: {
    colonyAddress,
    domainId,
    userAddress,
    roles,
    authority,
    colonyName,
    annotationMessage,
    customActionTitle,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_USER_ROLES_SET>) {
  let txChannel;
  try {
    const colonyManager: ColonyManager = yield getColonyManager();

    if (!userAddress) {
      throw new Error('User address not set for setUserRole transaction');
    }

    if (!domainId) {
      throw new Error('Domain id not set for setUserRole transaction');
    }

    if (!roles) {
      throw new Error('Roles not set for setUserRole transaction');
    }

    if (roles[ColonyRole.ArchitectureSubdomain]) {
      throw new Error(
        'The Architecture Subdomain roles has been deprecated at a contract level and should not be set',
      );
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = TRANSACTION_METHODS.SetUserRoles;

    const { setUserRoles, annotateSetUserRoles } =
      yield createTransactionChannels(metaId, [
        'setUserRoles',
        'annotateSetUserRoles',
      ]);

    const roleArray = Object.keys(roles)
      .map((roleId) => parseInt(roleId, 10))
      .filter((roleId) => {
        if (roleId === ColonyRole.ArchitectureSubdomain) {
          return false;
        }
        // Administration role cannot be set for multi sig
        if (
          authority === Authority.ViaMultiSig &&
          roleId === ColonyRole.Administration
        ) {
          return false;
        }
        if (!roles[roleId]) {
          return false;
        }
        return true;
      });

    const contextMap = {
      [Authority.Own]: ClientType.ColonyClient,
      [Authority.ViaMultiSig]: ClientType.MultisigPermissionsClient,
    };

    yield createGroupTransaction({
      channel: setUserRoles,
      batchKey,
      meta,
      config: {
        context: contextMap[authority],
        methodName: 'setUserRoles',
        identifier: colonyAddress,
        params: [],
        ready: false,
      },
    });

    if (annotationMessage) {
      yield createGroupTransaction({
        channel: annotateSetUserRoles,
        batchKey,
        meta,
        config: {
          context: ClientType.ColonyClient,
          methodName: 'annotateTransaction',
          identifier: colonyAddress,
          params: [],
          ready: false,
        },
      });
    }

    yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateSetUserRoles.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(setUserRoles.id));

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      domainId,
      domainId === Id.RootDomain ? ColonyRole.Root : ColonyRole.Architecture,
    );

    yield transactionSetParams(setUserRoles.id, [
      permissionDomainId,
      childSkillIndex,
      userAddress,
      domainId,
      intArrayToBytes32(roleArray),
    ]);

    yield initiateTransaction(setUserRoles.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(setUserRoles.channel);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateSetUserRoles,
        message: annotationMessage,
        txHash,
      });
    }

    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.ACTION_USER_ROLES_SET_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    yield putError(ActionTypes.ACTION_USER_ROLES_SET_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* managePermissionsActionSaga() {
  yield takeEvery(ActionTypes.ACTION_USER_ROLES_SET, managePermissionsAction);
}
