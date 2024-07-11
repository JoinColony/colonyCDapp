import {
  type AnyStreamingPaymentsClient,
  ClientType,
  ColonyRole,
  getPermissionProofs,
} from '@colony/colony-js';
import { type BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import {
  type ColonyManager,
  ContextModule,
  getContext,
} from '~context/index.ts';
import {
  type UpdateStreamingPaymentMetadataMutation,
  type UpdateStreamingPaymentMetadataMutationVariables,
  UpdateStreamingPaymentMetadataDocument,
} from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/index.ts';
import { getExpenditureDatabaseId } from '~utils/databaseId.ts';
import { toNumber } from '~utils/numbers.ts';
import { getStreamingPaymentLimit } from '~utils/streamingPayments.ts';
import { getSelectedToken } from '~utils/tokens.ts';

import {
  createTransaction,
  waitForTxResult,
  getTxChannel,
} from '../transactions/index.ts';
import {
  TIMESTAMP_IN_FUTURE,
  getColonyManager,
  getEndTimeByEndCondition,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

export type EditStreamingPaymentPayload =
  Action<ActionTypes.STREAMING_PAYMENT_EDIT>['payload'];

function* editStreamingPaymentAction({
  payload: {
    colony,
    streamingPayment,
    streamingPaymentsAddress,
    startTimestamp,
    endTimestamp,
    amount,
    interval,
    endCondition,
    limitAmount,
  },
  meta,
}: Action<ActionTypes.STREAMING_PAYMENT_EDIT>) {
  const { colonyAddress } = colony;
  const apolloClient = getContext(ContextModule.ApolloClient);

  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const batchKey = 'editStreamingPayment';

  const txChannel = yield call(getTxChannel, meta.id);

  try {
    const { decimals: tokenDecimals } =
      getSelectedToken(colony, streamingPayment.tokenAddress) || {};

    if (!tokenDecimals) {
      throw new Error('Token cannot be found');
    }

    const streamingPaymentsClient: AnyStreamingPaymentsClient = yield call(
      [colonyManager, colonyManager.getClient],
      ClientType.StreamingPaymentsClient,
      colonyAddress,
    );

    // Get permissions proof of the caller's Funding permission
    const [fundingPermissionDomainId, fundingChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        streamingPayment.nativeDomainId,
        ColonyRole.Funding,
      );

    // Get permissions proof of the caller's Admin permission
    const [adminPermissionDomainId, adminChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        streamingPayment.nativeDomainId,
        ColonyRole.Administration,
      );

    // Get permissions proof of the streaming payment extensions funding and administration permissions
    const [extensionPermissionDomainId, extensionChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        streamingPayment.nativeDomainId,
        [ColonyRole.Funding, ColonyRole.Administration],
        streamingPaymentsAddress,
      );

    const amountInWei = amount
      ? (moveDecimal(amount, tokenDecimals) as string)
      : streamingPayment.amount;

    const realStartTimestamp = startTimestamp || streamingPayment.startTime;
    const realInterval = interval || Number(streamingPayment.interval);
    const realEndCondition =
      endCondition || streamingPayment.metadata?.endCondition;

    if (!realEndCondition) {
      throw new Error(
        'End condition undefined and cannot be found in metadata',
      );
    }

    const limitInWei = limitAmount
      ? (moveDecimal(limitAmount, tokenDecimals) as string)
      : getStreamingPaymentLimit({ streamingPayment });

    const realEndTimestamp = getEndTimeByEndCondition({
      endCondition: realEndCondition,
      startTimestamp: realStartTimestamp,
      interval: realInterval,
      amountInWei,
      limitInWei,
      endTimestamp: endTimestamp || streamingPayment.endTime,
    });

    const multicallData: string[] = [];

    const hasAmountChanged = amountInWei !== streamingPayment.amount;
    const hasIntervalChanged =
      realInterval !== Number(streamingPayment.interval);

    if (hasAmountChanged || hasIntervalChanged) {
      multicallData.push(
        streamingPaymentsClient.interface.encodeFunctionData('setTokenAmount', [
          fundingPermissionDomainId,
          fundingChildSkillIndex,
          extensionPermissionDomainId,
          extensionChildSkillIndex,
          extensionChildSkillIndex,
          extensionChildSkillIndex,
          streamingPayment.nativeId,
          amountInWei,
          realInterval,
        ]),
      );
    }

    const hasStartTimeChanged =
      streamingPayment.startTime !== realStartTimestamp;
    const hasEndTimeChanged = !realEndTimestamp.eq(streamingPayment.endTime);

    const pushSetStartTime = (time: string) => {
      multicallData.push(
        streamingPaymentsClient.interface.encodeFunctionData('setStartTime', [
          adminPermissionDomainId,
          adminChildSkillIndex,
          streamingPayment.nativeId,
          time,
        ]),
      );
    };

    const pushSetEndTime = (time: BigNumber) => {
      multicallData.push(
        streamingPaymentsClient.interface.encodeFunctionData('setEndTime', [
          adminPermissionDomainId,
          adminChildSkillIndex,
          streamingPayment.nativeId,
          time,
        ]),
      );
    };

    // @NOTE: The multicall will fail if we set the new start time to be before the current end time
    // Or the new end time to be before the current start time
    // If both are true, then first set the endTime to the maximum possible end time
    if (
      realStartTimestamp > streamingPayment.endTime &&
      realEndTimestamp.lt(streamingPayment.startTime)
    ) {
      if (hasEndTimeChanged) {
        pushSetEndTime(TIMESTAMP_IN_FUTURE);
      }

      if (hasStartTimeChanged) {
        pushSetStartTime(realStartTimestamp);
      }

      if (hasEndTimeChanged) {
        pushSetEndTime(realEndTimestamp);
      }
    } else if (realStartTimestamp > streamingPayment.endTime) {
      if (hasEndTimeChanged) {
        pushSetEndTime(realEndTimestamp);
      }

      if (hasStartTimeChanged) {
        pushSetStartTime(realStartTimestamp);
      }
    } else {
      if (hasStartTimeChanged) {
        pushSetStartTime(realStartTimestamp);
      }

      if (hasEndTimeChanged) {
        pushSetEndTime(realEndTimestamp);
      }
    }

    yield fork(createTransaction, meta.id, {
      context: ClientType.StreamingPaymentsClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      params: [multicallData],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      const hasEndConditionChanged =
        endCondition !== undefined &&
        endCondition !== streamingPayment.metadata?.endCondition;

      if (hasEndConditionChanged) {
        yield apolloClient.mutate<
          UpdateStreamingPaymentMetadataMutation,
          UpdateStreamingPaymentMetadataMutationVariables
        >({
          mutation: UpdateStreamingPaymentMetadataDocument,
          variables: {
            input: {
              id: getExpenditureDatabaseId(
                colonyAddress,
                toNumber(streamingPayment.nativeId),
              ),
              endCondition,
            },
          },
        });
      }

      yield put<AllActions>({
        type: ActionTypes.STREAMING_PAYMENT_EDIT_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(
      ActionTypes.STREAMING_PAYMENT_EDIT_ERROR,
      error,
      meta,
    );
  }

  txChannel.close();
  return null;
}

export default function* editStreamingPaymentSaga() {
  yield takeEvery(
    ActionTypes.STREAMING_PAYMENT_EDIT,
    editStreamingPaymentAction,
  );
}
