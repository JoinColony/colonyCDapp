import { ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action, type AllActions } from '~redux/types/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { clearContributorsAndRolesCache } from '~utils/members.ts';

import {
  createTransaction,
  waitForTxResult,
  getTxChannel,
  type ChannelDefinition,
  createTransactionChannels,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

function* setThresholds({
  payload: { colonyAddress, globalThreshold, domainThresholds },
  meta,
}: Action<ActionTypes.MULTISIG_SET_THRESHOLDS>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const batchKey = TRANSACTION_METHODS.SetMultiSigThresholds;

  const colonyManager = yield getColonyManager();
  const multiSigClient = yield colonyManager.getClient(
    ClientType.MultisigPermissionsClient,
    colonyAddress,
  );

  try {
    const { setThresholdsMulticall }: Record<string, ChannelDefinition> =
      yield createTransactionChannels(meta.id, ['setThresholdsMulticall']);
    const encodedMulticallData: string[] = [];

    encodedMulticallData.push(
      multiSigClient.interface.encodeFunctionData('setGlobalThreshold', [
        globalThreshold,
      ]),
    );

    for (const { skillId, threshold } of domainThresholds) {
      encodedMulticallData.push(
        multiSigClient.interface.encodeFunctionData('setDomainSkillThreshold', [
          BigNumber.from(skillId),
          threshold,
        ]),
      );
    }

    yield fork(createTransaction, setThresholdsMulticall.id, {
      context: ClientType.MultisigPermissionsClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      params: [encodedMulticallData],
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
    });

    yield takeFrom(
      setThresholdsMulticall.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    yield initiateTransaction(setThresholdsMulticall.id);

    yield waitForTxResult(setThresholdsMulticall.channel);

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
