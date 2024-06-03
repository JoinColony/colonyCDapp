import { type AnyColonyClient, ClientType } from '@colony/colony-js';
import { takeEvery, call, fork, put } from 'redux-saga/effects';

import { userRolePermissions } from '~constants/permissions.ts';
import type ColonyManager from '~context/ColonyManager.ts';
import { MultiSigVote } from '~gql';
import { type Action, ActionTypes, type AllActions } from '~redux';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  getPermissionProofsLocal,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

export type VoteOnMultiSigActionPayload =
  Action<ActionTypes.MULTISIG_VOTE>['payload'];

const voteToNumber: Record<MultiSigVote, number> = {
  [MultiSigVote.None]: 0,
  [MultiSigVote.Approve]: 1,
  [MultiSigVote.Reject]: 2,
};

function* voteOnMultiSigAction({
  payload: {
    colonyAddress,
    colonyDomains,
    colonyRoles,
    vote,
    multiSigId,
    requiredRole,
    domainId,
  },
  meta,
}: Action<ActionTypes.MULTISIG_VOTE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    if (!colonyAddress || !multiSigId) {
      throw new Error('No colony address or multiSigId');
    }

    const requiredColonyRoles = userRolePermissions[requiredRole];
    const colonyManager: ColonyManager = yield getColonyManager();

    const colonyClient: AnyColonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const userAddress = yield colonyClient.signer.getAddress();

    const [, childSkillIndex] = yield call(
      getPermissionProofsLocal,
      colonyClient.networkClient,
      colonyRoles,
      colonyDomains,
      domainId,
      requiredColonyRoles,
      userAddress,
      true,
    );

    yield fork(createTransaction, meta.id, {
      context: ClientType.MultisigPermissionsClient,
      methodName: 'changeVote',
      identifier: colonyAddress,
      params: [domainId, childSkillIndex, multiSigId, voteToNumber[vote]],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.MULTISIG_VOTE_SUCCESS,
        meta,
      });
    }
  } catch (error) {
    yield putError(ActionTypes.MULTISIG_VOTE_ERROR, error, meta);
  }

  txChannel.close();
}

export default function* voteOnMultiSigSaga() {
  yield takeEvery(ActionTypes.MULTISIG_VOTE, voteOnMultiSigAction);
}
