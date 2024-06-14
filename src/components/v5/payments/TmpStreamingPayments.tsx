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
import { type CancelStreamingPaymentPayload } from '~redux/types/actions/expenditures.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { getStreamingPaymentDatabaseId } from '~utils/databaseId.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import InputBase from '~v5/common/Fields/InputBase/InputBase.tsx';
import Select from '~v5/common/Fields/Select/Select.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import { ActionButton } from '~v5/shared/Button/index.ts';

const TmpStreamingPayments = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { streamingPaymentsAddress } = useEnabledExtensions();

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
      (blockTime ?? Math.floor(Date.now() / 1000)) - 604800,
    ).toString(), // One week ago
    tokenAddress,
    tokenDecimals: parseInt(decimalAmount, 10),
    endTimestamp: BigNumber.from(
      (blockTime ?? Math.floor(Date.now() / 1000)) + 604800,
    ).toString(), // Next week
    limitAmount: limit,
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
        <InputBase
          value={streamingPaymentId}
          onChange={(e) => setStreamingPaymentId(e.currentTarget.value)}
          placeholder="Streaming Payment ID"
        />
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
        </div>
      </div>
    </div>
  );
};

export default TmpStreamingPayments;
