import React from 'react';

import { currencySymbolMap } from '~constants/currency.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { useStreamingPaymentsTotalFunds } from '~shared/StreamingPayments/hooks.ts';
import { formatText } from '~utils/intl.ts';

import StatsCards from './partials/StatsCards/StatsCards.tsx';

const displayName = 'v5.pages.StreamingPaymentsPage';

const StreamingPaymentsPage = () => {
  useSetPageHeadingTitle(
    formatText({ id: 'navigation.finances.streamingPayments' }),
  );

  const nativeDomainId = useGetSelectedDomainFilter()?.nativeId;

  const {
    totalFunds,
    activeStreamingPayments,
    currency,
    totalStreamed,
    totalLastMonthStreaming,
  } = useStreamingPaymentsTotalFunds({
    isFilteredByWalletAddress: false,
    nativeDomainId,
  });

  return (
    <div>
      <StatsCards
        streamingPerMonth={totalLastMonthStreaming}
        totalActiveStreams={activeStreamingPayments}
        totalStreamed={totalStreamed}
        unclaimedFounds={totalFunds.totalAvailable}
        prefix={currencySymbolMap[currency]}
        suffix={currency}
      />
    </div>
  );
};

StreamingPaymentsPage.displayName = displayName;

export default StreamingPaymentsPage;
