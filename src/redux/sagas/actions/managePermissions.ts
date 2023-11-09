import { call, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  ColonyRole,
  getPermissionProofs,
  Id,
} from '@colony/colony-js';

import { ColonyManager } from '~context';
import { intArrayToBytes32 } from '~utils/web3';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import {
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
  getColonyManager,
  createActionMetadataInDB,
} from '../utils';

import {
  createGroupTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionAddParams, transactionPending } from '../../actionCreators';

function* managePermissionsAction({
  payload: {
    colonyAddress,
    domainId,
    userAddress,
    roles,
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

    const batchKey = 'setUserRoles';

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
        if (!roles[roleId]) {
          return false;
        }
        return true;
      });

    yield createGroupTransaction(setUserRoles, batchKey, meta, {
      context: ClientType.ColonyClient,
      methodName: 'setUserRoles',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateSetUserRoles, batchKey, meta, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
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

    yield put(
      transactionAddParams(setUserRoles.id, [
        permissionDomainId,
        childSkillIndex,
        userAddress,
        domainId,
        intArrayToBytes32(roleArray),
      ]),
    );
    yield initiateTransaction({ id: setUserRoles.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      setUserRoles.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateSetUserRoles,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_USER_ROLES_SET_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/colony/${colonyName}/tx/${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_USER_ROLES_SET_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* managePermissionsActionSaga() {
  yield takeEvery(ActionTypes.ACTION_USER_ROLES_SET, managePermissionsAction);
}
