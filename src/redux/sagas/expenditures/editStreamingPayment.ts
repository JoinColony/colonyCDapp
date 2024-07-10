import {
  type AnyStreamingPaymentsClient,
  ClientType,
  ColonyRole,
  getPermissionProofs,
} from '@colony/colony-js';
import { BigNumber } from 'ethers';
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
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

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
    colony: { colonyAddress, tokens },
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
      tokens?.items.find(
        (token) => token?.token.tokenAddress === streamingPayment.tokenAddress,
      )?.token || {};

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

    const convertedAmount = amount
      ? BigNumber.from(amount).mul(
          BigNumber.from(10).pow(getTokenDecimalsWithFallback(tokenDecimals)),
        )
      : BigNumber.from(streamingPayment.amount);

    const realStartTimestamp = startTimestamp || streamingPayment.startTime;
    const realInterval = interval || Number(streamingPayment.interval);
    const realLimitAmount =
      limitAmount || getStreamingPaymentLimit({ streamingPayment });
    const realEndCondition =
      endCondition || streamingPayment.metadata?.endCondition;

    if (!realEndCondition) {
      throw new Error(
        'End condition undefined and cannot be found in metadata',
      );
    }

    const realEndTimestamp = getEndTimeByEndCondition({
      endCondition: realEndCondition,
      startTimestamp: realStartTimestamp,
      interval: realInterval,
      convertedAmount,
      tokenDecimals,
      limitAmount: realLimitAmount,
      endTimestamp: endTimestamp || streamingPayment.endTime,
    });

    const multicallData: string[] = [];

    const hasAmountChanged = !convertedAmount.eq(streamingPayment.amount);
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
          convertedAmount,
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
