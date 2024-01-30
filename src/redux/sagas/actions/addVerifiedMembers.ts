import { ClientType, ColonyRole, getPermissionProofs } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import ColonyManager from '~context/ColonyManager';
import { Action, AllActions, ActionTypes } from '~redux';
import { transactionAddParams } from '~redux/actionCreators';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import {
  createActionMetadataInDB,
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
  uploadAnnotation,
} from '../utils';
import { getAddVerifiedMembersOperation } from '../utils/verifiedMembers';

function* addVerifiedMembersAction({
  payload: {
    colonyAddress,
    colonyName,
    members,
    customActionTitle,
    domainId,
    annotationMessage,
  },
  meta: { id: metaId, navigate, setTxHash },
  meta,
}: Action<ActionTypes.ACTION_ADD_VERIFIED_MEMBERS>) {
  let txChannel;

  try {
    if (!domainId) {
      throw new Error('Domain not set for addVerifiedMembers transaction');
    }
    if (!colonyAddress) {
      throw new Error(
        'No colony address set for addVerifiedMembers transaction',
      );
    }
    if (!Array.isArray(members) || members.length === 0) {
      throw new Error('No members set for addVerifiedMembers transaction');
    }

    txChannel = yield call(getTxChannel, metaId);
    const colonyManager: ColonyManager = yield getColonyManager();

    // setup batch ids and channels
    const batchKey = 'addVerifiedMembers';

    const { addVerifiedMembers, annotateAddVerifiedMembers } =
      yield createTransactionChannels(metaId, [
        'addVerifiedMembers',
        'annotateAddVerifiedMembersAction',
      ]);

    yield fork(createTransaction, addVerifiedMembers.id, {
      context: ClientType.ColonyClient,
      methodName: 'metadataDelta',
      identifier: colonyAddress,
      params: [],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateAddVerifiedMembers.id, {
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

    yield takeFrom(addVerifiedMembers.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateAddVerifiedMembers.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      domainId,
      ColonyRole.Architecture,
    );

    // add params, how to blobify the last JSON??
    yield put(
      transactionAddParams(addVerifiedMembers.id, [
        permissionDomainId,
        childSkillIndex,
        domainId,
        getAddVerifiedMembersOperation(colonyAddress, members),
      ]),
    );

    yield initiateTransaction({ id: addVerifiedMembers.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      addVerifiedMembers.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    yield takeFrom(
      addVerifiedMembers.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    yield createActionMetadataInDB(txHash, customActionTitle);

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateAddVerifiedMembers,
        message: annotationMessage,
        txHash,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_ADD_VERIFIED_MEMBERS_SUCCESS,
      payload: {},
      meta,
    });

    if (colonyName && navigate) {
      navigate(`/${colonyName}?tx=${txHash}`, {
        state: { isRedirect: true },
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* addVerifiedMembersActionSaga() {
  yield takeEvery(
    ActionTypes.ACTION_ADD_VERIFIED_MEMBERS,
    addVerifiedMembersAction,
  );
}
