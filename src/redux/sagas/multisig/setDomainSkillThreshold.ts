import { ClientType } from '@colony/colony-js';
import { fork, put, takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action, type AllActions } from '~redux/types/index.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

function* setDomainSkillThreshold({
  payload: { colonyAddress, thresholds },
  meta,
}: Action<ActionTypes.SET_DOMAIN_SKILL_THRESHOLD>) {
  const batchKey = 'setDomainSkillThresholdAction';

  const { setDomainSkillThresholdAction }: Record<string, ChannelDefinition> =
    yield createTransactionChannels(meta.id, ['setDomainSkillThresholdAction']);

  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  try {
    const encodedMulticallData: string[] = [];

    for (const domainId of Object.keys(thresholds)) {
      const { skillId } = yield colonyClient.getDomain(domainId);

      encodedMulticallData.push(
        colonyClient.interface.encodeFunctionData('setDomainSkillThreshold', [
          skillId,
          thresholds[domainId],
        ]),
      );
    }

    yield fork(createTransaction, setDomainSkillThresholdAction.id, {
      context: ClientType.MultisigPermissionsClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: [encodedMulticallData],
    });

    yield takeFrom(
      setDomainSkillThresholdAction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield initiateTransaction({ id: setDomainSkillThresholdAction.id });

    yield waitForTxResult(setDomainSkillThresholdAction.channel);

    yield put<AllActions>({
      type: ActionTypes.RELEASE_EXPENDITURE_STAGE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.RELEASE_EXPENDITURE_STAGE_ERROR,
      error,
      meta,
    );
  }

  setDomainSkillThresholdAction.channel.close();

  return null;
}

export default function* releaseExpenditureStageSaga() {
  yield takeEvery(
    ActionTypes.SET_DOMAIN_SKILL_THRESHOLD,
    setDomainSkillThreshold,
  );
}
