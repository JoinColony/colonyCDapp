import React from 'react';

import { useStreamingPaymentsTotalFunds } from '~common/Extensions/UserHub/partials/BalanceTab/partials/StreamsInfoRow/hooks.ts';
import { currencySymbolMap } from '~constants/currency.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { formatText } from '~utils/intl.ts';

import StatsCards from './partials/StatsCards/StatsCards.tsx';

const displayName = 'v5.pages.StreamingPaymentsPage';

const StreamingPaymentsPage = () => {
  useSetPageHeadingTitle(
    formatText({ id: 'navigation.finances.streamingPayments' }),
  );

  const nativeDomainId = useGetSelectedDomainFilter()?.nativeId;

  const { totalFunds, activeStreamingPayments, averagePerMonth, currency } =
    useStreamingPaymentsTotalFunds({
      getDataByRecipentAddress: false,
      nativeDomainId,
    });

  return (
    <div>
      <StatsCards
        streamingPerMonth={averagePerMonth}
        totalActiveStreams={activeStreamingPayments}
        totalStreamed={totalFunds.totalClaimed}
        unclaimedFounds={totalFunds.totalAvailable}
        prefix={currencySymbolMap[currency]}
        suffix={currency}
      />
    </div>
  );
};

StreamingPaymentsPage.displayName = displayName;

export default StreamingPaymentsPage;
