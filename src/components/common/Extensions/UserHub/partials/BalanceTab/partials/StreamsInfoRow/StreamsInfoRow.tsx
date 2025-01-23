// @todo: uncomment and update when claim all streams functionality will be implemented
// import { HandArrowDown, WarningCircle } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import UserHubInfoSection from '~common/Extensions/UserHub/partials/UserHubInfoSection/UserHubInfoSection.tsx';
import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { currencySymbolMap } from '~constants/currency.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { useStreamingPaymentsTotalFunds } from '~shared/StreamingPayments/hooks.ts';
import { formatText } from '~utils/intl.ts';
// @todo: uncomment and update when claim all streams functionality will be implemented
// import Button from '~v5/shared/Button/Button.tsx';
// import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';

import AvailableToClaimCounter from '../AvailableToClaimCounter/AvailableToClaimCounter.tsx';

const displayName =
  'common.Extensions.UserHub.partials.BalanceTab.partials.StreamsInfoRow';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Streams',
  },
  totalClaimed: {
    id: `${displayName}.totalClaimed`,
    defaultMessage: 'Total claimed',
  },
  availableToClaim: {
    id: `${displayName}.availableToClaim`,
    defaultMessage: 'Available to claim',
  },
  claimAllStreams: {
    id: `${displayName}.claimAllStreams`,
    defaultMessage: 'Claim all streams',
  },
  viewStreams: {
    id: `${displayName}.viewStreams`,
    defaultMessage: 'View streams',
  },
  insufficientFundsErrorMessage: {
    id: `${displayName}.insufficientFundsErrorMessage`,
    defaultMessage: 'Insufficient funds in teams to claim all funds.',
  },
});

const StreamsInfoRow: FC = () => {
  const {
    isAnyPaymentActive,
    loading,
    totalFunds,
    ratePerSecond,
    currency,
    getTotalFunds,
    streamingPayments,
  } = useStreamingPaymentsTotalFunds({});

  return (
    <UserHubInfoSection
      title={formatText(MSG.title)}
      // @todo: uncomment and update url when streams page will be ready
      // viewLinkProps={{
      //   text: formatText(MSG.viewStreams),
      //   to: '#',
      // }}
      items={[
        {
          key: '1',
          label: formatText(MSG.totalClaimed),
          value: (
            <LoadingSkeleton
              isLoading={loading}
              className="ml-auto h-5 w-12 rounded"
            >
              {totalFunds.totalClaimed ? (
                <Numeral
                  value={totalFunds.totalClaimed}
                  prefix={currencySymbolMap[currency]}
                  suffix={` ${currency}`}
                />
              ) : (
                <span>
                  {currencySymbolMap[currency]} 0.00 {currency}
                </span>
              )}
            </LoadingSkeleton>
          ),
        },
        {
          key: '2',
          label: formatText(MSG.availableToClaim),
          value: (
            <LoadingSkeleton
              isLoading={loading}
              className="ml-auto h-5 w-12 rounded"
            >
              {streamingPayments.length ? (
                <AvailableToClaimCounter
                  amountAvailableToClaim={totalFunds.totalAvailable}
                  getTotalFunds={() => getTotalFunds(streamingPayments)}
                  isAtLeastOnePaymentActive={isAnyPaymentActive}
                  ratePerSecond={ratePerSecond}
                />
              ) : (
                <span>
                  {currencySymbolMap[currency]} 0.00 {currency}
                </span>
              )}
            </LoadingSkeleton>
          ),
        },
      ]}
    >
      {/* @todo: uncomment and update when claim all streams functionality will be implemented */}
      {/* <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end sm:gap-4">
        <NotificationBanner
          status="error"
          icon={WarningCircle}
          className="flex-grow !px-2.5 !py-2"
          description={formatText(MSG.insufficientFundsErrorMessage)}
          descriptionClassName="!text-xs"
          iconSize={12}
        />
        <Button
          mode="primaryOutline"
          size="medium"
          icon={HandArrowDown}
          iconSize={18}
          text={formatText(MSG.claimAllStreams)}
          onClick={() => {}}
          className="!px-2.5"
        />
      </div> */}
    </UserHubInfoSection>
  );
};

StreamsInfoRow.displayName = displayName;
export default StreamsInfoRow;
