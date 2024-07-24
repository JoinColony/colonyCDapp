import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action, type AllActions } from '~redux/types/index.ts';
import { clearContributorsAndRolesCache } from '~utils/members.ts';

import {
  createTransaction,
  waitForTxResult,
  getTxChannel,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
} from '../utils/index.ts';

function* setThresholds({
  payload: { colonyAddress, globalThreshold, domainThresholds },
  meta,
}: Action<ActionTypes.MULTISIG_SET_THRESHOLDS>) {
  const txChannel = yield call(getTxChannel, meta.id);

  const colonyManager = yield getColonyManager();
  const multiSigClient = yield colonyManager.getClient(
    ClientType.MultisigPermissionsClient,
    colonyAddress,
  );

  try {
    const encodedMulticallData: string[] = [];

    encodedMulticallData.push(
      multiSigClient.interface.encodeFunctionData('setGlobalThreshold', [
        globalThreshold,
      ]),
    );

    for (const { skillId, threshold } of domainThresholds) {
      encodedMulticallData.push(
        multiSigClient.interface.encodeFunctionData('setDomainSkillThreshold', [
          skillId,
          threshold,
        ]),
      );
    }

    yield fork(createTransaction, meta.id, {
      context: ClientType.MultisigPermissionsClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      params: [encodedMulticallData],
    });

    yield initiateTransaction({ id: meta.id });

    yield waitForTxResult(txChannel);

    yield put<AllActions>({
      type: ActionTypes.MULTISIG_SET_THRESHOLDS_SUCCESS,
      meta,
    });

    yield clearContributorsAndRolesCache();
  } catch (error) {
    return yield putError(
      ActionTypes.MULTISIG_SET_THRESHOLDS_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();

  return null;
}

export default function* setThresholdsSaga() {
  yield takeEvery(ActionTypes.MULTISIG_SET_THRESHOLDS, setThresholds);
}
