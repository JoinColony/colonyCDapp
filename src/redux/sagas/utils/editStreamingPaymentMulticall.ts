import {
  type AnyColonyClient,
  type AnyStreamingPaymentsClient,
  ColonyRole,
  getPermissionProofs,
} from '@colony/colony-js';
import { type BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';

import { type ColonyFragment, type StreamingPaymentEndCondition } from '~gql';
import { type StreamingPayment } from '~types/graphql.ts';
import { getStreamingPaymentLimit } from '~utils/streamingPayments.ts';
import { getSelectedToken } from '~utils/tokens.ts';

import {
  TIMESTAMP_IN_FUTURE,
  getEndTimeByEndCondition,
} from './getEndTimeByEndCondition.ts';

interface GetEditStreamingPaymentMulticallDataParams {
  streamingPayment: StreamingPayment;
  colonyClient: AnyColonyClient;
  streamingPaymentsAddress: string;
  colony: ColonyFragment;
  streamingPaymentsClient: AnyStreamingPaymentsClient;
  amount?: string;
  interval?: number;
  startTimestamp?: string;
  endTimestamp?: string;
  limitAmount?: string;
  endCondition?: StreamingPaymentEndCondition;
}

/**
 * Helper function returning an array of encoded multicall data containing transactions
 * needed to update expenditure payouts using `setExpenditureState`
 * This allows non-owners to edit expenditures or owners to edit locked expenditures
 */
export const getEditStreamingPaymentMulticallData = async ({
  streamingPayment,
  colonyClient,
  streamingPaymentsAddress,
  colony,
  streamingPaymentsClient,
  amount,
  interval,
  startTimestamp,
  endTimestamp,
  limitAmount,
  endCondition,
}: GetEditStreamingPaymentMulticallDataParams) => {
  const { decimals: tokenDecimals } =
    getSelectedToken(colony, streamingPayment.tokenAddress) || {};

  if (!tokenDecimals) {
    throw new Error('Token cannot be found');
  }

  // Get permissions proof of the caller's Funding permission
  const [fundingPermissionDomainId, fundingChildSkillIndex] =
    await getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      streamingPayment.nativeDomainId,
      ColonyRole.Funding,
    );

  // Get permissions proof of the caller's Admin permission
  const [adminPermissionDomainId, adminChildSkillIndex] =
    await getPermissionProofs(
      colonyClient.networkClient,
      colonyClient,
      streamingPayment.nativeDomainId,
      ColonyRole.Administration,
    );

  // Get permissions proof of the streaming payment extensions funding and administration permissions
  const [extensionPermissionDomainId, extensionChildSkillIndex] =
    await getPermissionProofs(
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
    throw new Error('End condition undefined and cannot be found in metadata');
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
  const hasIntervalChanged = realInterval !== Number(streamingPayment.interval);

  if (hasAmountChanged || hasIntervalChanged) {
    multicallData.push(
      // @TODO: Fix this
      // @ts-ignore
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

  const hasStartTimeChanged = streamingPayment.startTime !== realStartTimestamp;
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

  return multicallData;
};
