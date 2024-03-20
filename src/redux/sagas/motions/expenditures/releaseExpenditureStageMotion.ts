import {
  type AnyVotingReputationClient,
  ClientType,
  ColonyRole,
  getPermissionProofs,
  Id,
} from '@colony/colony-js';
import { call, put, takeEvery } from 'redux-saga/effects';

import { ADDRESS_ZERO, APP_URL } from '~constants';
import { ExpenditureStatus } from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import {
  createGroupTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import {
  getMulticallDataForStageRelease,
  getColonyManager,
  initiateTransaction,
} from '~redux/sagas/utils/index.ts';
import { type Action } from '~redux/types/index.ts';
import { takeFrom } from '~utils/saga/effects.ts';

export type ReleaseExpenditureStageMotionPayload =
  Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE>['payload'];

function* releaseExpenditureStageMotion({
  payload: {
    colonyAddress,
    colonyName,
    expenditure,
    slotId,
    motionDomainId,
    tokenAddresses,
  },
  meta,
  meta: { setTxHash, id },
}: Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE>) {
  const batchId = 'motion-release-expenditure-stage';
  const { createMotion /* annotationMessage */ } = yield call(
    createTransactionChannels,
    id,
    ['createMotion', 'annotateMotion'],
  );
  const colonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  try {
    if (expenditure.status !== ExpenditureStatus.Finalized) {
      throw new Error(
        'Expenditure must be finalized in order to release expenditure stage',
      );
    }

    const votingReputationClient: AnyVotingReputationClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      expenditure.nativeDomainId,
      ColonyRole.Arbitration,
      votingReputationClient.address,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      Id.RootDomain,
    );

    const { key, value, branchMask, siblings } = yield call(
      [colonyClient, colonyClient.getReputation],
      skillId,
      ADDRESS_ZERO,
    );

    const encodedMulticallData: string[] = getMulticallDataForStageRelease(
      expenditure,
      slotId,
      colonyClient,
      permissionDomainId,
      childSkillIndex,
      tokenAddresses,
    );

    const encodedReleaseStagedPaymentAction =
      yield colonyClient.interface.encodeFunctionData('multicall', [
        encodedMulticallData,
      ]);

    yield createGroupTransaction(createMotion, batchId, meta, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        childSkillIndex,
        ADDRESS_ZERO,
        encodedReleaseStagedPaymentAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        title: { id: 'transaction.group.createMotion.title' },
        description: {
          id: 'transaction.group.createMotion.description',
        },
      },
    });

    yield initiateTransaction({ id: createMotion.id });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    setTxHash?.(txHash);

    const { type } = yield call(waitForTxResult, createMotion.channel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_SUCCESS>>({
        type: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_SUCCESS,
        meta,
      });

      // @TODO: Remove during advanced payments UI wiring
      // eslint-disable-next-line no-console
      console.log(`Motion URL: ${APP_URL}${colonyName}?tx=${txHash}`);
    }

    window.history.replaceState(
      {},
      '',
      `${APP_URL}${window.location.pathname}?tx=${txHash}`,
    );
  } catch (e) {
    console.error(e);
    yield put<Action<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_ERROR>>({
      type: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_ERROR,
      payload: {
        name: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_ERROR,
        message: JSON.stringify(e),
      },
      meta,
      error: true,
    });
  } finally {
    createMotion.channel.close();
  }
}

export default function* releaseExpenditureStageSaga() {
  yield takeEvery(
    ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE,
    releaseExpenditureStageMotion,
  );
}
