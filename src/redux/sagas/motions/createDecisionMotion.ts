import {
  type AnyColonyClient,
  ClientType,
  getChildIndex,
} from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { ACTION_DECISION_MOTION_CODE, ADDRESS_ZERO } from '~constants/index.ts';
import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateColonyDecisionDocument,
  type CreateColonyDecisionMutation,
  type CreateColonyDecisionMutationVariables,
} from '~gql';
import { type Action, ActionTypes, type AllActions } from '~redux/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';
import { putError, takeFrom } from '~utils/saga/effects.ts';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions/index.ts';
import { getColonyDecisionId } from '../utils/decisionMotion.ts';
import { getColonyManager, initiateTransaction } from '../utils/index.ts';

function* createDecisionMotion({
  payload: {
    colonyAddress,
    draftDecision: { motionDomainId, title, description, walletAddress },
  },
  meta: { id: metaId, setTxHash },
  meta,
}: Action<ActionTypes.MOTION_CREATE_DECISION>) {
  const txChannel = yield call(getTxChannel, metaId);
  const apolloClient = getContext(ContextModule.ApolloClient);

  try {
    // Validate the required values
    if (!colonyAddress) {
      throw new Error('Colony address is required when creating a Decision.');
    }

    if (!title) {
      throw new Error('Decision title is required when creating a Decision.');
    }

    if (!motionDomainId) {
      throw new Error('Motion Domain id is required when creating a Decision.');
    }

    const colonyManager = yield call(getColonyManager);
    const colonyClient: AnyColonyClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.ColonyClient,
      colonyAddress,
    );

    const childSkillIndex = yield call(
      getChildIndex,
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      motionDomainId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      ADDRESS_ZERO,
    );

    // setup batch ids and channels
    const batchKey = TRANSACTION_METHODS.CreateMotion;

    const { createMotion /* annotateMotion */ } = yield call(
      createTransactionChannels,
      metaId,
      ['createMotion' /* 'annotateMotion' */],
    );

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        childSkillIndex,
        ADDRESS_ZERO,
        ACTION_DECISION_MOTION_CODE,
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
    });

    // yield fork(createTransaction, annotateMotion.id, {
    //   context: ClientType.ColonyClient,
    //   methodName: 'annotateTransaction',
    //   identifier: colonyAddress,
    //   params: [],
    //   group: {
    //     key: batchKey,
    //     id: metaId,
    //     index: 1,
    //   },
    //   ready: false,
    // });

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    // yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction(createMotion.id);

    const {
      payload: { hash: txHash },
    } = yield takeFrom(createMotion.channel, [
      ActionTypes.TRANSACTION_HASH_RECEIVED,
      ActionTypes.TRANSACTION_ERROR,
    ]);

    yield mutateWithAuthRetry(() =>
      apolloClient.mutate<
        CreateColonyDecisionMutation,
        CreateColonyDecisionMutationVariables
      >({
        mutation: CreateColonyDecisionDocument,
        variables: {
          input: {
            id: getColonyDecisionId(colonyAddress, txHash),
            actionId: txHash,
            colonyAddress,
            description,
            title,
            motionDomainId,
            walletAddress,
            showInDecisionsList: false,
          },
        },
      }),
    );

    // yield transactionSetPending(annotateMotion.id);

    // yield put(
    //   transactionAddParams(annotateMotion.id, [
    //     txHash,
    //     JSON.stringify(decision),
    //   ]),
    // );

    // yield put(transactionReady(annotateMotion.id));

    // yield waitForTxResult(annotateMotion.channel);
    //
    setTxHash?.(txHash);

    yield put<AllActions>({
      type: ActionTypes.MOTION_CREATE_DECISION_SUCCESS,
      meta,
    });

    yield put({
      type: ActionTypes.DECISION_DRAFT_REMOVED,
      payload: { walletAddress, colonyAddress },
    });
  } catch (caughtError) {
    console.error('the kot error', caughtError);
    yield putError(ActionTypes.MOTION_CREATE_DECISION_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* createDecisionMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_CREATE_DECISION, createDecisionMotion);
}
