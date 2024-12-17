import { Id } from '@colony/colony-js';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC, useState, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { ActionTypes } from '~redux';
import { type ClaimStreamingPaymentPayload } from '~redux/sagas/expenditures/claimStreamingPayment.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { formatText } from '~utils/intl.ts';
import { getSelectedToken } from '~utils/tokens.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import StreamingPaymentStatusPill from '~v5/common/ActionSidebar/partials/StreamingPaymentStatusPill/StreamingPaymentStatusPill.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import MenuWithSections from '~v5/shared/MenuWithSections/MenuWithSections.tsx';

import AvailableToClaimCounter from '../AvailableToClaimCounter/AvailableToClaimCounter.tsx';
import CreatedWithPermissionsInfo from '../CreatedWithPermissionsInfo/CreatedWithPermissionsInfo.tsx';

import { useHasEnoughTokensToClaim } from './hooks.ts';
import { type StreamingPaymentWidgetProps } from './types.ts';

const displayName =
  'v5.common.CompletedAction.partials.StreamingPayment.partials.StreamingPaymentWidget';

const MSG = defineMessages({
  streamingStatus: {
    id: `${displayName}.streamingStatus`,
    defaultMessage: 'Streaming status',
  },
  paidToDate: {
    id: `${displayName}.paidToDate`,
    defaultMessage: 'Paid to date',
  },
  availableToClaim: {
    id: `${displayName}.availableToClaim`,
    defaultMessage: 'Available to claim',
  },
  payFunds: {
    id: `${displayName}.payFunds`,
    defaultMessage: 'Pay funds',
  },
  insufficientFunds: {
    id: `${displayName}.insufficientFunds`,
    defaultMessage: 'Insufficient funds in team. Ensure team is funded.',
  },
  transferFunds: {
    id: `${displayName}.transferFunds`,
    defaultMessage: 'Transfer required funds',
  },
});

const StreamingPaymentWidget: FC<StreamingPaymentWidgetProps> = ({
  action,
  streamingPayment,
}) => {
  const {
    streamingPaymentData,
    refetchStreamingPayment,
    loadingStreamingPayment,
    amounts,
    paymentStatus,
    updateAmountsAndStatus,
  } = streamingPayment;
  const { colony } = useColonyContext();
  const { streamingPaymentsAddress } = useEnabledExtensions();
  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (streamingPaymentData && !loadingStreamingPayment) {
      updateAmountsAndStatus(
        streamingPaymentData,
        Math.floor(blockTime ?? Date.now() / 1000),
        !!action.isMotion,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStreamingPayment, streamingPaymentData]);

  const checkIfHasEnoughFunds = useHasEnoughTokensToClaim(
    streamingPaymentData?.nativeDomainId || Id.RootDomain,
    streamingPaymentData?.tokenAddress || '',
    amounts.amountAvailableToClaim,
  );

  const [hasEnoughFunds, setHasEnoughFunds] = useState(checkIfHasEnoughFunds());

  useEffect(() => {
    setHasEnoughFunds(checkIfHasEnoughFunds());
  }, [checkIfHasEnoughFunds]);

  const claim = useAsyncFunction({
    submit: ActionTypes.STREAMING_PAYMENT_CLAIM,
    error: ActionTypes.STREAMING_PAYMENT_CLAIM_ERROR,
    success: ActionTypes.STREAMING_PAYMENT_CLAIM_SUCCESS,
  });

  const handleClaim = async () => {
    if (!streamingPaymentData) {
      return;
    }

    setIsLoading(true);

    try {
      const hasEnoughFundsToMakeClaim = checkIfHasEnoughFunds();

      if (!hasEnoughFundsToMakeClaim) {
        setHasEnoughFunds(false);
        return;
      }

      const claimPayload: ClaimStreamingPaymentPayload = {
        colonyAddress: colony.colonyAddress,
        streamingPaymentsAddress: streamingPaymentsAddress ?? '',
        streamingPayment: streamingPaymentData,
      };

      await claim(claimPayload);

      refetchStreamingPayment();
      fetchCurrentBlockTime();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!streamingPaymentData) {
    return null;
  }

  const { tokenAddress, createdAt } = streamingPaymentData;
  const selectedToken = getSelectedToken(colony, tokenAddress || '');

  const ratePerSecond = BigNumber.from(streamingPaymentData.amount || '0')
    .div(streamingPaymentData.interval || 1)
    .toString();

  return (
    <div
      className={clsx('flex flex-col', {
        'gap-2': !action.isMotion,
        'gap-8': action.isMotion,
      })}
    >
      <MenuWithSections
        sections={[
          ...(hasEnoughFunds
            ? []
            : [
                {
                  key: '0',
                  className:
                    'bg-negative-100 text-negative-400 flex flex-col gap-1 items-start !py-3',
                  content: (
                    <>
                      <p className="text-sm">
                        {formatText(MSG.insufficientFunds)}
                      </p>
                      <button
                        type="button"
                        className="inline-block text-xs font-medium underline"
                        onClick={() =>
                          toggleActionSidebarOn({
                            [ACTION_TYPE_FIELD_NAME]: Action.TransferFunds,
                          })
                        }
                      >
                        {formatText(MSG.transferFunds)}
                      </button>
                    </>
                  ),
                },
              ]),
          {
            key: '1',
            content: (
              <>
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-1">{formatText(MSG.streamingStatus)}</h4>
                  <LoadingSkeleton
                    isLoading={isLoading}
                    className="h-[1.625rem] w-14 rounded"
                  >
                    <StreamingPaymentStatusPill status={paymentStatus} />
                  </LoadingSkeleton>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-600">
                    {formatText(MSG.paidToDate)}
                  </span>
                  <LoadingSkeleton
                    isLoading={isLoading}
                    className="h-[1.125rem] w-14 rounded"
                  >
                    <Numeral
                      value={amounts.amountClaimedToDate}
                      decimals={selectedToken?.decimals}
                      suffix={` ${selectedToken?.symbol}`}
                      className="text-gray-900"
                    />
                  </LoadingSkeleton>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                  <span
                    className={clsx({
                      'text-gray-600': hasEnoughFunds,
                      'text-negative-400': !hasEnoughFunds,
                    })}
                  >
                    {formatText(MSG.availableToClaim)}
                  </span>
                  <LoadingSkeleton
                    isLoading={isLoading}
                    className="h-[1.125rem] w-14 rounded"
                  >
                    <AvailableToClaimCounter
                      hasEnoughFunds={hasEnoughFunds}
                      status={paymentStatus}
                      onTimeEnd={fetchCurrentBlockTime}
                      amountAvailableToClaim={amounts.amountAvailableToClaim}
                      decimals={
                        selectedToken?.decimals || colony.nativeToken.decimals
                      }
                      tokenSymbol={
                        selectedToken?.symbol || colony.nativeToken.symbol
                      }
                      getAmounts={() =>
                        updateAmountsAndStatus(
                          streamingPaymentData,
                          Math.floor(blockTime ?? Date.now() / 1000),
                          !!action.isMotion,
                        )
                      }
                      ratePerSecond={ratePerSecond}
                    />
                  </LoadingSkeleton>
                </div>
                <div className="mt-6 flex min-h-10 w-full justify-center">
                  <Button
                    className="w-full"
                    onClick={handleClaim}
                    disabled={BigNumber.from(
                      amounts.amountAvailableToClaim,
                    ).isZero()}
                    loading={isLoading}
                  >
                    {formatText(MSG.payFunds)}
                  </Button>
                </div>
              </>
            ),
          },
        ]}
      />
      {action.isMotion ? (
        <p>Add motion steps here</p>
      ) : (
        <CreatedWithPermissionsInfo
          userAdddress={action.initiatorAddress}
          createdAt={createdAt}
        />
      )}
    </div>
  );
};

StreamingPaymentWidget.displayName = displayName;
export default StreamingPaymentWidget;
