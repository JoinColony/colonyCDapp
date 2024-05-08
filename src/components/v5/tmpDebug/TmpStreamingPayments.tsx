import { gql, useLazyQuery } from '@apollo/client';
import { Extension, Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import React, { useState } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  StreamingPaymentEndCondition,
  useGetStreamingPaymentQuery,
} from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux';
import { type ClaimStreamingPaymentPayload } from '~redux/sagas/expenditures/claimStreamingPayment.ts';
import { type CreateStreamingPaymentPayload } from '~redux/sagas/expenditures/createStreamingPayment.ts';
import {
  type EditStreamingPaymentPayload,
  type CancelStreamingPaymentPayload,
} from '~redux/types/actions/expenditures.ts';
import {
  type StreamingPaymentsMotionEditPayload,
  type StreamingPaymentsMotionCancelPayload,
  type StreamingPaymentsMotionCreatePayload,
} from '~redux/types/actions/motion.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { getStreamingPaymentDatabaseId } from '~utils/databaseId.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import {
  getStreamingPaymentLimit,
  getStreamingPaymentAmountsLeft,
} from '~utils/streamingPayments.ts';
import { getSelectedToken } from '~utils/tokens.ts';
import InputBase from '~v5/common/Fields/InputBase/InputBase.tsx';
import Select from '~v5/common/Fields/Select/Select.tsx';
import Switch from '~v5/common/Fields/Switch/Switch.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import { ActionButton } from '~v5/shared/Button/index.ts';

import { useTmpContext } from './context/TmpContext.ts';

enum StartTime {
  Now = 'now',
  OneWeekAgo = 'one-week-ago',
  OneWeekFromNow = 'one-week-from-now',
  TwoWeeksFromNow = 'two-weeks-from-now',
}

enum EndTime {
  TwoWeeksFromNow = 'two-weeks-from-now',
  ThreeWeeksFromNow = 'three-weeks-from-now',
  FourWeeksFromNow = 'four-weeks-from-now',
}

enum Interval {
  Hourly = 'hourly',
  Daily = 'daily',
  Weekly = 'weekly',
}

const TmpStreamingPayments = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { streamingPaymentsAddress, votingReputationAddress } =
    useEnabledExtensions();
  const [getStreamingPayments] = useLazyQuery(gql`
    query ListStreamingPayments {
      listStreamingPayments {
        nextToken
        items {
          nativeId
        }
      }
    }
  `);
  const { annotation } = useTmpContext();

  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();

  const [tokenAddress, setTokenAddress] = useState(
    colony.nativeToken.tokenAddress,
  );
  const [decimalAmount, setDecimalAmount] = useState('18');
  const [transactionAmount, setTransactionAmount] = useState('0');
  const [endCondition, setEndCondition] = useState(
    StreamingPaymentEndCondition.FixedTime,
  );
  const [selectedStartTime, setSelectedStartTime] = useState(StartTime.Now);
  const [selectedEndTime, setSelectedEndTime] = useState(
    EndTime.TwoWeeksFromNow,
  );
  const [selectedInterval, setSelectedInterval] = useState(Interval.Hourly);
  const [limit, setLimit] = useState('0');
  const [streamingPaymentId, setStreamingPaymentId] = useState('');
  const [updateStartTime, setUpdateStartTime] = useState(false);
  const [updateEndTime, setUpdateEndTime] = useState(false);
  const [updateAmount, setUpdateAmount] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(false);
  const [updateEndCondition, setUpdateEndCondition] = useState(false);
  const [updateLimit, setUpdateLimit] = useState(false);

  const { extensionData } = useExtensionData(Extension.StreamingPayments);

  const { extensionData } = useExtensionData(Extension.StreamingPayments);

  const { data, refetch } = useGetStreamingPaymentQuery({
    variables: {
      streamingPaymentId: getStreamingPaymentDatabaseId(
        colony.colonyAddress,
        Number(streamingPaymentId),
      ),
    },
    skip: Number.isNaN(streamingPaymentId),
    fetchPolicy: 'network-only',
  });
  const streamingPayment = data?.getStreamingPayment;

  const cancel = useAsyncFunction({
    submit: ActionTypes.STREAMING_PAYMENT_CANCEL,
    error: ActionTypes.STREAMING_PAYMENT_CANCEL_ERROR,
    success: ActionTypes.STREAMING_PAYMENT_CANCEL_SUCCESS,
  });
  const claim = useAsyncFunction({
    submit: ActionTypes.STREAMING_PAYMENT_CLAIM,
    error: ActionTypes.STREAMING_PAYMENT_CLAIM_ERROR,
    success: ActionTypes.STREAMING_PAYMENT_CLAIM_SUCCESS,
  });
  const editStreamingPayment = useAsyncFunction({
    submit: ActionTypes.STREAMING_PAYMENT_EDIT,
    error: ActionTypes.STREAMING_PAYMENT_EDIT_ERROR,
    success: ActionTypes.STREAMING_PAYMENT_EDIT_SUCCESS,
  });
  const editStreamingPaymentMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_STREAMING_PAYMENT_EDIT,
    error: ActionTypes.MOTION_STREAMING_PAYMENT_EDIT_ERROR,
    success: ActionTypes.MOTION_STREAMING_PAYMENT_EDIT_SUCCESS,
  });
  const cancelMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL,
    error: ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL_ERROR,
    success: ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL_SUCCESS,
  });

  const { amountAvailableToClaim, amountClaimedToDate } =
    getStreamingPaymentAmountsLeft(
      streamingPayment,
      Math.floor(blockTime ?? Date.now() / 1000),
    );

  const rootDomain = findDomainByNativeId(Id.RootDomain, colony);
  if (!rootDomain) {
    return null;
  }

  const getStartTime = (startTime: StartTime) => {
    switch (startTime) {
      case StartTime.OneWeekAgo: {
        return BigNumber.from(
          (blockTime ?? Math.floor(Date.now() / 1000)) - 604800,
        ).toString();
      }
      case StartTime.OneWeekFromNow: {
        return BigNumber.from(
          (blockTime ?? Math.floor(Date.now() / 1000)) + 604800,
        ).toString();
      }
      case StartTime.TwoWeeksFromNow: {
        return BigNumber.from(
          (blockTime ?? Math.floor(Date.now() / 1000)) + 604800 * 2,
        ).toString();
      }
      case StartTime.Now:
      default: {
        return BigNumber.from(
          blockTime ?? Math.floor(Date.now() / 1000),
        ).toString();
      }
    }
  };

  const getEndTime = (endTime: EndTime) => {
    switch (endTime) {
      case EndTime.FourWeeksFromNow: {
        return BigNumber.from(
          (blockTime ?? Math.floor(Date.now() / 1000)) + 604800 * 4,
        ).toString();
      }
      case EndTime.ThreeWeeksFromNow: {
        return BigNumber.from(
          (blockTime ?? Math.floor(Date.now() / 1000)) + 604800 * 3,
        ).toString();
      }
      case EndTime.TwoWeeksFromNow:
      default: {
        return BigNumber.from(
          (blockTime ?? Math.floor(Date.now() / 1000)) + 604800 * 2,
        ).toString();
      }
    }
  };

  const getInterval = (interval: Interval) => {
    switch (interval) {
      case Interval.Weekly: {
        return 3600 * 24 * 7;
      }
      case Interval.Daily: {
        return 3600 * 24;
      }
      case Interval.Hourly:
      default: {
        return 3600;
      }
    }
  };

  const createStreamingPaymentPayload: CreateStreamingPaymentPayload = {
    colonyAddress: colony.colonyAddress,
    createdInDomain: rootDomain,
    amount: transactionAmount,
    endCondition,
    interval: getInterval(selectedInterval),
    recipientAddress: user?.walletAddress ?? '',
    startTimestamp: getStartTime(selectedStartTime),
    tokenAddress,
    tokenDecimals: parseInt(decimalAmount, 10),
    endTimestamp: getEndTime(selectedEndTime),
    limitAmount: limit,
    annotationMessage: annotation,
  };

  const handleCancel = async ({
    shouldWaive,
  }: Pick<CancelStreamingPaymentPayload, 'shouldWaive'>) => {
    if (!streamingPayment) {
      return;
    }

    const payload: CancelStreamingPaymentPayload = {
      colonyAddress: colony.colonyAddress,
      streamingPayment,
      userAddress: user?.walletAddress ?? '',
      shouldWaive,
      annotationMessage: annotation,
    };

    await cancel(payload);
  };

  const handleClaim = async () => {
    if (!streamingPayment) {
      return;
    }

    const claimPayload: ClaimStreamingPaymentPayload = {
      colonyAddress: colony.colonyAddress,
      streamingPaymentsAddress: streamingPaymentsAddress ?? '',
      streamingPayment,
    };

    await claim(claimPayload);
  };

  const handleCancelMotion = async () => {
    if (!streamingPayment || !votingReputationAddress) {
      return;
    }

    const payload: StreamingPaymentsMotionCancelPayload = {
      colony,
      motionDomainId: Id.RootDomain,
      streamingPayment,
      votingReputationAddress,
      annotationMessage: annotation,
    };

    await cancelMotion(payload);
  };

  const handleGetLatestMotionId = () => {
    getStreamingPayments({
      onCompleted: (d) => {
        if (d) {
          const latestStreamingPaymentNativeID =
            d?.listStreamingPayments?.items?.length;

          if (!latestStreamingPaymentNativeID) return;

          setStreamingPaymentId(latestStreamingPaymentNativeID || '');
        }
      },
    });
  };

  const handleEdit = async () => {
    if (!streamingPayment || !streamingPaymentsAddress) {
      return;
    }

    const fixedPayload: EditStreamingPaymentPayload = {
      colony,
      streamingPayment,
      streamingPaymentsAddress,
      startTimestamp: updateStartTime
        ? getStartTime(selectedStartTime)
        : undefined,
      amount: updateAmount ? transactionAmount : undefined,
      interval: updateInterval ? getInterval(selectedInterval) : undefined,
      endCondition: StreamingPaymentEndCondition.FixedTime,
      endTimestamp: updateEndTime ? getEndTime(selectedEndTime) : undefined,
    };

    const limitPayload: EditStreamingPaymentPayload = {
      colony,
      streamingPayment,
      streamingPaymentsAddress,
      startTimestamp: updateStartTime
        ? getStartTime(selectedStartTime)
        : undefined,
      amount: updateAmount ? transactionAmount : undefined,
      interval: updateInterval ? getInterval(selectedInterval) : undefined,
      endCondition: StreamingPaymentEndCondition.LimitReached,
      limitAmount: updateLimit ? limit : undefined,
    };

    const whenCancelledPayload: EditStreamingPaymentPayload = {
      colony,
      streamingPayment,
      streamingPaymentsAddress,
      startTimestamp: updateStartTime
        ? getStartTime(selectedStartTime)
        : undefined,
      amount: updateAmount ? transactionAmount : undefined,
      interval: updateInterval ? getInterval(selectedInterval) : undefined,
      endCondition: StreamingPaymentEndCondition.WhenCancelled,
    };

    const undefinedEndConditionPayload: EditStreamingPaymentPayload = {
      colony,
      streamingPayment,
      streamingPaymentsAddress,
      startTimestamp: updateStartTime
        ? getStartTime(selectedStartTime)
        : undefined,
      endTimestamp: updateEndTime ? getEndTime(selectedEndTime) : undefined,
      amount: updateAmount ? transactionAmount : undefined,
      interval: updateInterval ? getInterval(selectedInterval) : undefined,
      limitAmount: updateLimit ? limit : undefined,
    };

    let payload: EditStreamingPaymentPayload = undefinedEndConditionPayload;

    if (updateEndCondition) {
      if (endCondition === StreamingPaymentEndCondition.FixedTime) {
        payload = fixedPayload;
      }
      if (endCondition === StreamingPaymentEndCondition.LimitReached) {
        payload = limitPayload;
      }
      if (endCondition === StreamingPaymentEndCondition.WhenCancelled) {
        payload = whenCancelledPayload;
      }
    }

    await editStreamingPayment(payload);
  };

  const handleEditMotion = async () => {
    if (
      !streamingPayment ||
      !streamingPaymentsAddress ||
      !votingReputationAddress
    ) {
      return;
    }

    const fixedPayload: StreamingPaymentsMotionEditPayload = {
      motionDomainId: Id.RootDomain,
      votingReputationAddress,
      annotationMessage: annotation,
      colony,
      streamingPayment,
      streamingPaymentsAddress,
      startTimestamp: updateStartTime
        ? getStartTime(selectedStartTime)
        : undefined,
      amount: updateAmount ? transactionAmount : undefined,
      interval: updateInterval ? getInterval(selectedInterval) : undefined,
      endCondition: StreamingPaymentEndCondition.FixedTime,
      endTimestamp: updateEndTime ? getEndTime(selectedEndTime) : undefined,
    };

    const limitPayload: StreamingPaymentsMotionEditPayload = {
      motionDomainId: Id.RootDomain,
      votingReputationAddress,
      annotationMessage: annotation,
      colony,
      streamingPayment,
      streamingPaymentsAddress,
      startTimestamp: updateStartTime
        ? getStartTime(selectedStartTime)
        : undefined,
      amount: updateAmount ? transactionAmount : undefined,
      interval: updateInterval ? getInterval(selectedInterval) : undefined,
      endCondition: StreamingPaymentEndCondition.LimitReached,
      limitAmount: updateLimit ? limit : undefined,
    };

    const whenCancelledPayload: StreamingPaymentsMotionEditPayload = {
      motionDomainId: Id.RootDomain,
      votingReputationAddress,
      annotationMessage: annotation,
      colony,
      streamingPayment,
      streamingPaymentsAddress,
      startTimestamp: updateStartTime
        ? getStartTime(selectedStartTime)
        : undefined,
      amount: updateAmount ? transactionAmount : undefined,
      interval: updateInterval ? getInterval(selectedInterval) : undefined,
      endCondition: StreamingPaymentEndCondition.WhenCancelled,
    };

    const undefinedEndConditionPayload: StreamingPaymentsMotionEditPayload = {
      motionDomainId: Id.RootDomain,
      votingReputationAddress,
      annotationMessage: annotation,
      colony,
      streamingPayment,
      streamingPaymentsAddress,
      startTimestamp: updateStartTime
        ? getStartTime(selectedStartTime)
        : undefined,
      endTimestamp: updateEndTime ? getEndTime(selectedEndTime) : undefined,
      amount: updateAmount ? transactionAmount : undefined,
      interval: updateInterval ? getInterval(selectedInterval) : undefined,
      limitAmount: updateLimit ? limit : undefined,
    };

    let payload: StreamingPaymentsMotionEditPayload =
      undefinedEndConditionPayload;

    if (updateEndCondition) {
      if (endCondition === StreamingPaymentEndCondition.FixedTime) {
        payload = fixedPayload;
      }
      if (endCondition === StreamingPaymentEndCondition.LimitReached) {
        payload = limitPayload;
      }
      if (endCondition === StreamingPaymentEndCondition.WhenCancelled) {
        payload = whenCancelledPayload;
      }
    }

    await editStreamingPaymentMotion(payload);
  };

  const createStreamingPaymentMotionPayload: StreamingPaymentsMotionCreatePayload =
    {
      ...createStreamingPaymentPayload,
      motionDomainId: Id.RootDomain,
      votingReputationAddress: votingReputationAddress ?? '',
      annotationMessage: annotation,
      startTimestamp: '0',
    };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-4 rounded-lg bg-gray-100 p-3">
        <h2 className="block w-full font-bold">Streaming Payments</h2>
        <div className="flex items-end gap-4">
          <InputBase
            onChange={(e) => setTokenAddress(e.currentTarget.value)}
            value={tokenAddress}
            label="Token Address"
          />
          <InputBase
            onChange={(e) => setDecimalAmount(e.currentTarget.value)}
            value={decimalAmount}
            label="Token Decimals"
          />
          <InputBase
            onChange={(e) => setTransactionAmount(e.currentTarget.value)}
            value={transactionAmount}
            label="Transaction Amount"
          />
          <InputBase
            onChange={(e) => setLimit(e.currentTarget.value)}
            value={limit}
            label="Limit"
            disabled={
              endCondition !== StreamingPaymentEndCondition.LimitReached
            }
          />
        </div>
        <div className="flex gap-4">
          <Select
            options={[
              {
                value: StreamingPaymentEndCondition.FixedTime,
                label: 'Fixed time',
              },
              {
                value: StreamingPaymentEndCondition.LimitReached,
                label: 'Limit reached',
              },
              {
                value: StreamingPaymentEndCondition.WhenCancelled,
                label: 'When cancelled',
              },
            ]}
            defaultValue={StreamingPaymentEndCondition.FixedTime}
            value={endCondition}
            onChange={(value) =>
              setEndCondition(value?.value as StreamingPaymentEndCondition)
            }
            className="w-full"
          />

          <Select
            options={[
              {
                value: StartTime.Now,
                label: 'Start now',
              },
              {
                value: StartTime.OneWeekAgo,
                label: 'Start one week ago',
              },
              {
                value: StartTime.OneWeekFromNow,
                label: 'Start one week from now',
              },
              {
                value: StartTime.TwoWeeksFromNow,
                label: 'Start two weeks from now',
              },
            ]}
            defaultValue={getStartTime(StartTime.Now)}
            value={selectedStartTime}
            onChange={(value) =>
              setSelectedStartTime(value?.value as StartTime)
            }
            className="w-full"
          />

          <Select
            options={[
              {
                value: EndTime.TwoWeeksFromNow,
                label: 'End two weeks from now',
              },
              {
                value: EndTime.ThreeWeeksFromNow,
                label: 'End three weeks from now',
              },
              {
                value: EndTime.FourWeeksFromNow,
                label: 'End four weeks from now',
              },
            ]}
            defaultValue={getEndTime(EndTime.TwoWeeksFromNow)}
            value={selectedEndTime}
            onChange={(value) => setSelectedEndTime(value?.value as EndTime)}
            className="w-full"
          />

          <Select
            options={[
              {
                value: Interval.Hourly,
                label: 'Hourly',
              },
              {
                value: Interval.Daily,
                label: 'Daily',
              },
              {
                value: Interval.Weekly,
                label: 'Weekly',
              },
            ]}
            defaultValue={3600}
            value={selectedInterval}
            onChange={(value) => setSelectedInterval(value?.value as Interval)}
            className="w-full"
          />

          <ActionButton
            actionType={ActionTypes.STREAMING_PAYMENT_CREATE}
            values={createStreamingPaymentPayload}
          >
            Create streaming payment
          </ActionButton>

          <ActionButton
            actionType={ActionTypes.MOTION_STREAMING_PAYMENT_CREATE}
            values={createStreamingPaymentMotionPayload}
            disabled={!votingReputationAddress}
          >
            Create via motion
          </ActionButton>
        </div>
        <div className="flex w-full gap-2">
          <InputBase
            value={streamingPaymentId}
            onChange={(e) => setStreamingPaymentId(e.currentTarget.value)}
            placeholder="Streaming Payment Native ID"
          />
          <Button onClick={handleGetLatestMotionId}>
            Use latest streaming payment native ID
          </Button>
        </div>
        {streamingPayment && (
          <div className="flex w-full flex-col gap-4">
            <p>
              Amount claimed to date:{' '}
              <b>
                <Numeral
                  value={amountClaimedToDate}
                  decimals={colony.nativeToken.decimals}
                />
              </b>
            </p>
            <p>
              Available to claim:{' '}
              <b>
                <Numeral
                  value={amountAvailableToClaim}
                  decimals={colony.nativeToken.decimals}
                />
              </b>
            </p>
            <p>
              Start time: <b>{streamingPayment.startTime}</b>
            </p>
            <p>
              End time: <b>{streamingPayment.endTime}</b>
            </p>
            <p>
              Amount:{' '}
              <b>
                <Numeral
                  value={streamingPayment.amount}
                  decimals={colony.nativeToken.decimals}
                />
              </b>
            </p>
            <p>
              Interval: <b>{streamingPayment.interval}</b>
            </p>
            <p>
              End Condition: <b>{streamingPayment.metadata?.endCondition}</b>
            </p>
            <p>
              Limit:{' '}
              <b>
                {moveDecimal(
                  getStreamingPaymentLimit({ streamingPayment }),
                  -(
                    getSelectedToken(colony, streamingPayment.tokenAddress)
                      ?.decimals || DEFAULT_TOKEN_DECIMALS
                  ),
                )}
              </b>
            </p>
          </div>
        )}
        <div className="flex w-full flex-wrap gap-4">
          <Button onClick={handleClaim} disabled={!streamingPayment}>
            Claim
          </Button>
          <Button
            onClick={() => {
              fetchCurrentBlockTime();
              refetch();
            }}
          >
            Refetch
          </Button>
          <Button onClick={() => handleEdit()} disabled={!streamingPayment}>
            Edit
          </Button>
          <Button
            onClick={() => handleCancel({ shouldWaive: false })}
            disabled={!streamingPayment}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleCancel({ shouldWaive: true });
            }}
            disabled={!streamingPayment}
          >
            Cancel and Waive
          </Button>
          <Button onClick={handleCancelMotion} disabled={!streamingPayment}>
            Cancel via motion
          </Button>
        </div>
        {streamingPayment && (
          <div className="flex w-full flex-wrap gap-4">
            <div className="flex items-center">
              <span>Update start time</span>
              <Switch
                checked={updateStartTime}
                onChange={(event) => setUpdateStartTime(event.target.checked)}
              />
            </div>
            <div className="flex items-center">
              <span>Update end time (for fixed end condition)</span>
              <Switch
                checked={updateEndTime}
                onChange={(event) => setUpdateEndTime(event.target.checked)}
              />
            </div>
            <div className="flex items-center">
              <span>Update amount</span>
              <Switch
                checked={updateAmount}
                onChange={(event) => setUpdateAmount(event.target.checked)}
              />
            </div>
            <div className="flex items-center">
              <span>Update interval</span>
              <Switch
                checked={updateInterval}
                onChange={(event) => setUpdateInterval(event.target.checked)}
              />
            </div>
            <div className="flex items-center">
              <span>Update end condition</span>
              <Switch
                checked={updateEndCondition}
                onChange={(event) =>
                  setUpdateEndCondition(event.target.checked)
                }
              />
            </div>
            <div className="flex items-center">
              <span>Update limit (for limit reached end condition)</span>
              <Switch
                checked={updateLimit}
                onChange={(event) => setUpdateLimit(event.target.checked)}
              />
            </div>
            <Button onClick={() => handleEdit()} disabled={!streamingPayment}>
              Edit
            </Button>
            <Button
              onClick={() => handleEditMotion()}
              disabled={!streamingPayment}
            >
              Edit via motion
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TmpStreamingPayments;
