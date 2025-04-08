import {
  ClientType,
  ColonyRole,
  getPermissionProofs,
  Id,
  type AnyStreamingPaymentsClient,
} from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { ADDRESS_ZERO, APP_URL } from '~constants';
import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateStreamingPaymentMetadataDocument,
  type CreateStreamingPaymentMetadataMutation,
  type CreateStreamingPaymentMetadataMutationVariables,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import {
  createGroupTransaction,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '~redux/sagas/transactions/index.ts';
import { takeFrom, putError } from '~redux/sagas/utils/effects.ts';
import {
  getColonyManager,
  initiateTransaction,
  uploadAnnotation,
  getEndTimeByEndCondition,
  createActionMetadataInDB,
} from '~redux/sagas/utils/index.ts';
import { type Action } from '~redux/types/index.ts';
import { getPendingMetadataDatabaseId } from '~utils/databaseId.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

export type CreateStreamingPaymentMotionPayload =
  Action<ActionTypes.MOTION_STREAMING_PAYMENT_CREATE>['payload'];

function* createStreamingPaymentMotion({
  payload: {
    colonyAddress,
    annotationMessage,
    motionDomainId,
    votingReputationAddress,
    createdInDomain,
    startTimestamp,
    endTimestamp,
    interval,
    recipientAddress,
    tokenAddress,
    tokenDecimals,
    amount,
    endCondition,
    limitAmount,
    customActionTitle,
  },
  meta,
  meta: { setTxHash },
}: Action<ActionTypes.MOTION_STREAMING_PAYMENT_CREATE>) {
  const apolloClient = getContext(ContextModule.ApolloClient);
  const batchKey = 'createMotion';

  const { createMotion, annotateMotion } = yield call(
    createTransactionChannels,
    meta.id,
    ['createMotion', 'annotateMotion'],
  );

  try {
    const colonyManager = yield getColonyManager();
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const streamingPaymentsClient: AnyStreamingPaymentsClient =
      yield colonyManager.getClient(
        ClientType.StreamingPaymentsClient,
        colonyAddress,
      );

    // Get permissions proof of the VotingRep's Funding permission
    const [fundingPermissionDomainId, fundingChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        createdInDomain.nativeId,
        ColonyRole.Funding,
        votingReputationAddress,
      );

    // Get permissions proof of the VotingRep's Admin permission
    const [adminPermissionDomainId, adminChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        createdInDomain.nativeId,
        ColonyRole.Administration,
        votingReputationAddress,
      );

    const [, childSkillIndex] = yield getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      motionDomainId,
      ColonyRole.Arbitration,
      votingReputationAddress,
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

    const convertedAmount = BigNumber.from(amount).mul(
      BigNumber.from(10).pow(getTokenDecimalsWithFallback(tokenDecimals)),
    );
    const limitInWei = limitAmount
      ? BigNumber.from(limitAmount).mul(
          BigNumber.from(10).pow(getTokenDecimalsWithFallback(tokenDecimals)),
        )
      : null;

    const realEndTimestamp = getEndTimeByEndCondition({
      endCondition,
      startTimestamp,
      interval,
      amountInWei: convertedAmount.toString(),
      limitInWei: limitInWei?.toString() || null,
      endTimestamp,
    });

    const encodedAction =
      yield streamingPaymentsClient.interface.encodeFunctionData('create', [
        fundingPermissionDomainId,
        fundingChildSkillIndex,
        adminPermissionDomainId,
        adminChildSkillIndex,
        createdInDomain.nativeId,
        startTimestamp,
        realEndTimestamp,
        interval,
        recipientAddress,
        tokenAddress,
        convertedAmount,
      ]);

    yield createGroupTransaction({
      channel: createMotion,
      batchKey,
      meta,
      config: {
        context: ClientType.VotingReputationClient,
        methodName: 'createMotion',
        identifier: colonyAddress,
        params: [
          motionDomainId,
          childSkillIndex,
          streamingPaymentsClient.address,
          encodedAction,
          key,
          value,
          branchMask,
          siblings,
        ],
      },
    });

    yield initiateTransaction(createMotion.id);

    if (annotationMessage) {
      yield fork(createTransaction, annotateMotion.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        group: {
          key: batchKey,
          id: meta.id,
          index: 1,
        },
        ready: false,
      });

      yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_CREATED);
    }

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(createMotion.channel);

    setTxHash?.(txHash);

    // Create pending metadata for the streaming payment
    yield mutateWithAuthRetry(() =>
      apolloClient.mutate<
        CreateStreamingPaymentMetadataMutation,
        CreateStreamingPaymentMetadataMutationVariables
      >({
        mutation: CreateStreamingPaymentMetadataDocument,
        variables: {
          input: {
            id: getPendingMetadataDatabaseId(colonyAddress, txHash),
            endCondition,
          },
        },
      }),
    );

    yield createActionMetadataInDB(txHash, { customTitle: customActionTitle });

    if (annotationMessage) {
      yield uploadAnnotation({
        txChannel: annotateMotion,
        message: annotationMessage,
        txHash,
      });
    }

    yield put({
      type: ActionTypes.MOTION_STREAMING_PAYMENT_CREATE_SUCCESS,
      meta,
    });

    // @TODO: Remove during advanced payments UI wiring
    // eslint-disable-next-line no-console
    console.log(
      `Create Streaming Payment Motion URL: ${APP_URL}${window.location.pathname.slice(
        1,
      )}?tx=${txHash}`,
    );
  } catch (e) {
    console.error(e);
    yield putError(ActionTypes.MOTION_STREAMING_PAYMENT_CREATE_ERROR, e, meta);
  } finally {
    createMotion.channel.close();
    annotateMotion.channel.close();
  }
}

export default function* createStreamingPaymentMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_STREAMING_PAYMENT_CREATE,
    createStreamingPaymentMotion,
  );
}
