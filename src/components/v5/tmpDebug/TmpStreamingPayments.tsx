import { gql, useLazyQuery } from '@apollo/client';
import { Id } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import React, { useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  StreamingPaymentEndCondition,
  useGetStreamingPaymentQuery,
} from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import useStreamingPaymentAmountsLeft from '~hooks/useStreamingPaymentAmountsLeft.ts';
import { ActionTypes } from '~redux';
import { type ClaimStreamingPaymentPayload } from '~redux/sagas/expenditures/claimStreamingPayment.ts';
import { type CreateStreamingPaymentPayload } from '~redux/sagas/expenditures/createStreamingPayment.ts';
import { type EditStreamingPaymentPayload } from '~redux/sagas/expenditures/editStreamingPayment.ts';
import { type CancelStreamingPaymentPayload } from '~redux/types/actions/expenditures.ts';
import { type StreamingPaymentsMotionCancelPayload } from '~redux/types/actions/motion.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { getStreamingPaymentDatabaseId } from '~utils/databaseId.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import InputBase from '~v5/common/Fields/InputBase/InputBase.tsx';
import Select from '~v5/common/Fields/Select/Select.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import { ActionButton } from '~v5/shared/Button/index.ts';

import { useTmpContext } from './context/TmpContext.ts';

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

  const [tokenAddress, setTokenAddress] = useState(
    colony.nativeToken.tokenAddress,
  );
  const [decimalAmount, setDecimalAmount] = useState('18');
  const [transactionAmount, setTransactionAmount] = useState('0');
  const [endCondition, setEndCondition] = useState(
    StreamingPaymentEndCondition.FixedTime,
  );
  const [limit, setLimit] = useState('0');
  const [streamingPaymentId, setStreamingPaymentId] = useState('');

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
  const cancelMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL,
    error: ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL_ERROR,
    success: ActionTypes.MOTION_STREAMING_PAYMENT_CANCEL_SUCCESS,
  });

  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();

  const { amountAvailableToClaim, amountClaimedToDate } =
    useStreamingPaymentAmountsLeft(
      streamingPayment,
      Math.floor(blockTime ?? Date.now() / 1000),
    );

  const rootDomain = findDomainByNativeId(Id.RootDomain, colony);
  if (!rootDomain) {
    return null;
  }

  const createStreamingPaymentPayload: CreateStreamingPaymentPayload = {
    colonyAddress: colony.colonyAddress,
    createdInDomain: rootDomain,
    amount: transactionAmount,
    endCondition,
    interval: 86400, // One day
    recipientAddress: user?.walletAddress ?? '',
    startTimestamp: BigNumber.from(
      (blockTime ?? Math.floor(Date.now() / 1000)) + 604800,
    ).toString(), // Next week
    tokenAddress,
    tokenDecimals: parseInt(decimalAmount, 10),
    endTimestamp: BigNumber.from(
      (blockTime ?? Math.floor(Date.now() / 1000)) + 604800 * 2,
    ).toString(), // Two weeks away
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

    const payload: EditStreamingPaymentPayload = {
      colonyAddress: colony.colonyAddress,
      streamingPayment,
      streamingPaymentsAddress,
      createdInDomain: rootDomain,
      amount: transactionAmount,
      endCondition: StreamingPaymentEndCondition.FixedTime,
      interval: 604800, // One week
      startTimestamp: streamingPayment.startTime,
      tokenAddress,
      tokenDecimals: parseInt(decimalAmount, 10),
      endTimestamp: BigNumber.from(
        (blockTime ?? Math.floor(Date.now() / 1000)) + 604800 * 3,
      ).toString(), // Three weeks away
    };

    await editStreamingPayment(payload);
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

          <ActionButton
            actionType={ActionTypes.STREAMING_PAYMENT_CREATE}
            values={createStreamingPaymentPayload}
          >
            Create streaming payment
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
          </div>
        )}
        <div className="flex flex-wrap gap-4 ">
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
      </div>
    </div>
  );
};

export default TmpStreamingPayments;
