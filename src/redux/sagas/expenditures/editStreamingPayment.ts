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
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import {
  createTransaction,
  waitForTxResult,
  getTxChannel,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

export type EditStreamingPaymentPayload =
  Action<ActionTypes.STREAMING_PAYMENT_EDIT>['payload'];

function* editStreamingPaymentAction({
  payload: {
    colonyAddress,
    streamingPayment,
    streamingPaymentsAddress,
    createdInDomain,
    tokenAddress,
    tokenDecimals,
    amount,
    startTimestamp,
    endTimestamp,
    // interval, @TODO: handle interval once setInterval contract method has been added
    endCondition,
    limitAmount,
  },
  meta,
}: Action<ActionTypes.STREAMING_PAYMENT_EDIT>) {
  // The create streaming payment contract method allows for multiple amounts
  // The CDapp UI only allows for one amount and the token cannot be changed
  // Here we check the token matches the existing payment
  if (streamingPayment.tokenAddress !== tokenAddress) {
    throw new Error('Streaming payment token cannot be changed');
  }

  const apolloClient = getContext(ContextModule.ApolloClient);

  const colonyManager: ColonyManager = yield getColonyManager();
  const colonyClient = yield colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );

  const batchKey = 'editStreamingPayment';

  const txChannel = yield call(getTxChannel, meta.id);

  try {
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
        createdInDomain.nativeId,
        ColonyRole.Funding,
      );

    // Get permissions proof of the caller's Admin permission
    const [adminPermissionDomainId, adminChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        createdInDomain.nativeId,
        ColonyRole.Administration,
      );

    // Get permissions proof of the streaming payment extensions funding and administration permissions
    const [extensionPermissionDomainId, extensionChildSkillIndex] =
      yield getPermissionProofs(
        colonyClient.networkClient,
        colonyClient,
        createdInDomain.nativeId,
        [ColonyRole.Funding, ColonyRole.Administration],
        streamingPaymentsAddress,
      );

    const convertedAmount = BigNumber.from(amount).mul(
      BigNumber.from(10).pow(getTokenDecimalsWithFallback(tokenDecimals)),
    );

    const multicallData: string[] = [];

    const hasAmountChanged = !convertedAmount.eq(streamingPayment.amount);

    if (hasAmountChanged) {
      multicallData.push(
        streamingPaymentsClient.interface.encodeFunctionData('setTokenAmount', [
          fundingPermissionDomainId,
          fundingChildSkillIndex,
          extensionPermissionDomainId,
          extensionChildSkillIndex,
          extensionChildSkillIndex,
          extensionChildSkillIndex,
          streamingPayment.nativeId,
          tokenAddress,
          convertedAmount,
        ]),
      );
    }

    const hasStartTimeChanged = streamingPayment.startTime !== startTimestamp;

    if (hasStartTimeChanged) {
      multicallData.push(
        streamingPaymentsClient.interface.encodeFunctionData('setStartTime', [
          adminPermissionDomainId,
          adminChildSkillIndex,
          streamingPayment.nativeId,
          startTimestamp,
        ]),
      );
    }

    const hasEndTimeChanged =
      endTimestamp && streamingPayment.endTime !== endTimestamp;

    if (hasEndTimeChanged) {
      multicallData.push(
        streamingPaymentsClient.interface.encodeFunctionData('setEndTime', [
          adminPermissionDomainId,
          adminChildSkillIndex,
          streamingPayment.nativeId,
          endTimestamp,
        ]),
      );
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
            limitAmount,
          },
        },
      });

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
