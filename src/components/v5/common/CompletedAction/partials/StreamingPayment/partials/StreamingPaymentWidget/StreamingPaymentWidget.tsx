import { Id } from '@colony/colony-js';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC, useState, useEffect, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useActionStatusContext } from '~context/ActionStatusContext/ActionStatusContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ButtonWithLoader } from '~frame/Extensions/pages/ExtensionDetailsPage/partials/ExtensionDetailsHeader/ButtonWithLoader.tsx';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { ActionTypes } from '~redux';
import { type ClaimStreamingPaymentPayload } from '~redux/sagas/expenditures/claimStreamingPayment.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { type StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { formatText } from '~utils/intl.ts';
import {
  getStreamingPaymentAmountsLeft,
  getStreamingPaymentStatus,
} from '~utils/streamingPayments.ts';
import { getSelectedToken } from '~utils/tokens.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { useGetStreamingPaymentData } from '~v5/common/ActionSidebar/hooks/useGetStreamingPaymentData.ts';
import ActionSidebarStatusPill from '~v5/common/ActionSidebar/partials/ActionSidebarStatusPill/ActionSidebarStatusPill.tsx';
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
}) => {
  const {
    loadingStreamingPayment,
    refetchStreamingPayment,
    streamingPaymentData,
  } = useGetStreamingPaymentData(action.streamingPaymentId);
  const {
    actionStatus,
    setActionStatus,
    isLoading: isLoadingStatus,
  } = useActionStatusContext();

  const { colony } = useColonyContext();
  const { streamingPaymentsAddress } = useEnabledExtensions();
  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const [isLoading, setIsLoading] = useState(false);
  const [amountClaimedToDate, setAmountClaimedToDate] = useState('0');
  const [amountAvailableToClaim, setAmountAvailableToClaim] = useState('0');

  const currentTime = useMemo(
    () => Math.floor(blockTime ?? Date.now() / 1000),
    [blockTime],
  );

  useEffect(() => {
    setActionStatus(
      getStreamingPaymentStatus({
        streamingPayment: streamingPaymentData,
        currentTimestamp: currentTime,
      }),
    );

    return () => {
      setActionStatus(null);
    };
  }, [currentTime, setActionStatus, streamingPaymentData]);

  useEffect(() => {
    const {
      amountClaimedToDate: amountClaimedToDateValue,
      amountAvailableToClaim: amountAvailableToClaimValue,
    } = getStreamingPaymentAmountsLeft(streamingPaymentData, currentTime);

    setAmountClaimedToDate(amountClaimedToDateValue);
    setAmountAvailableToClaim(amountAvailableToClaimValue);
  }, [currentTime, setActionStatus, streamingPaymentData]);

  useEffect(() => {
    fetchCurrentBlockTime();
  }, [actionStatus, fetchCurrentBlockTime]);

  const checkIfHasEnoughFunds = useHasEnoughTokensToClaim(
    streamingPaymentData?.nativeDomainId || Id.RootDomain,
    streamingPaymentData?.tokenAddress || '',
    amountAvailableToClaim,
  );

  const [hasEnoughFunds, setHasEnoughFunds] = useState(checkIfHasEnoughFunds());

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

      await fetchCurrentBlockTime();
      await refetchStreamingPayment();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingStreamingPayment) {
      fetchCurrentBlockTime();
    }
  }, [fetchCurrentBlockTime, loadingStreamingPayment]);

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
                    isLoading={loadingStreamingPayment || isLoadingStatus}
                    className="h-[1.625rem] w-14 rounded"
                  >
                    <ActionSidebarStatusPill />
                  </LoadingSkeleton>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-600">
                    {formatText(MSG.paidToDate)}
                  </span>
                  <LoadingSkeleton
                    isLoading={
                      loadingStreamingPayment || isLoadingStatus || isLoading
                    }
                    className="h-[1.125rem] w-14 rounded"
                  >
                    <Numeral
                      value={amountClaimedToDate}
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
                    isLoading={
                      loadingStreamingPayment || isLoadingStatus || isLoading
                    }
                    className="h-[1.125rem] w-14 rounded"
                  >
                    <AvailableToClaimCounter
                      hasEnoughFunds={hasEnoughFunds}
                      status={actionStatus as StreamingPaymentStatus}
                      amountAvailableToClaim={amountAvailableToClaim}
                      decimals={
                        selectedToken?.decimals || colony.nativeToken.decimals
                      }
                      tokenSymbol={
                        selectedToken?.symbol || colony.nativeToken.symbol
                      }
                      getAmounts={(currentTimeValue) => {
                        const {
                          amountAvailableToClaim: amountAvailableToClaimValue,
                        } = getStreamingPaymentAmountsLeft(
                          streamingPaymentData,
                          currentTimeValue,
                        );

                        const streamingPaymentStatus =
                          getStreamingPaymentStatus({
                            streamingPayment: streamingPaymentData,
                            currentTimestamp: currentTimeValue,
                          });

                        if (streamingPaymentStatus !== actionStatus) {
                          setActionStatus(streamingPaymentStatus);
                        }

                        setAmountAvailableToClaim(amountAvailableToClaimValue);
                      }}
                      ratePerSecond={ratePerSecond}
                      currentTime={currentTime}
                    />
                  </LoadingSkeleton>
                </div>
                <div className="mt-6 flex min-h-10 w-full justify-center">
                  <ButtonWithLoader
                    onClick={handleClaim}
                    isFullSize
                    disabled={
                      BigNumber.from(amountAvailableToClaim).isZero() ||
                      !hasEnoughFunds ||
                      loadingStreamingPayment ||
                      isLoadingStatus
                    }
                    loading={isLoading}
                  >
                    {formatText(MSG.payFunds)}
                  </ButtonWithLoader>
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
