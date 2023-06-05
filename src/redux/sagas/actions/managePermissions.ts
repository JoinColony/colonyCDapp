import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { hexlify, hexZeroPad } from 'ethers/lib/utils';
import { ClientType, ColonyRole } from '@colony/colony-js';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { putError, takeFrom } from '../utils';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionReady } from '../../actionCreators';

function* managePermissionsAction({
  payload: { colonyAddress, domainId, userAddress, roles, colonyName },
  meta: { id: metaId, navigate },
  meta,
}: Action<ActionTypes.ACTION_USER_ROLES_SET>) {
  let txChannel;
  try {
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

    const { setUserRoles } = yield createTransactionChannels(metaId, [
      'setUserRoles',
    ]);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
        },
      });

    const roleArray = Object.values(roles).reverse();
    /* Always make sure the Architecture Subdomain is false, it's deprecated */
    roleArray.splice(2, 0, false);

    let roleBitmask = '';

    roleArray.forEach((role) => {
      roleBitmask += role ? '1' : '0';
    });

    const hexString = hexlify(parseInt(roleBitmask, 2));
    const zeroPadHexString = hexZeroPad(hexString, 32);

    yield createGroupTransaction(setUserRoles, {
      context: ClientType.ColonyClient,
      methodName: 'setUserRolesWithProofs',
      identifier: colonyAddress,
      params: [userAddress, domainId, zeroPadHexString],
      ready: false,
    });

    yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(setUserRoles.id));

    yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_HASH_RECEIVED);

    const {
      payload: {
        receipt: { transactionHash },
      },
    } = yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.ACTION_USER_ROLES_SET_SUCCESS,
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/colony/${colonyName}/tx/${transactionHash}`);
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
