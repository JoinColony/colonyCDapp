import React from 'react';

import { currencySymbolMap } from '~constants/currency.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { useStreamingPaymentsTotalFunds } from '~shared/StreamingPayments/hooks.ts';
import { formatText } from '~utils/intl.ts';
import ContentWithTeamFilter from '~v5/frame/ContentWithTeamFilter/ContentWithTeamFilter.tsx';

import StatsCards from './partials/StatsCards/StatsCards.tsx';
import StreamingPaymentsTable from './partials/StreamingPaymentsTable/StreamingPaymentsTable.tsx';

const displayName = 'v5.pages.StreamingPaymentsPage';

const StreamingPaymentsPage = () => {
  useSetPageHeadingTitle(formatText({ id: 'streamingPaymentsPage.title' }));

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
    <ContentWithTeamFilter>
      <StatsCards
        streamingPerMonth={totalLastMonthStreaming}
        totalActiveStreams={activeStreamingPayments}
        totalStreamed={totalStreamed}
        unclaimedFounds={totalFunds.totalAvailable}
        prefix={currencySymbolMap[currency]}
        suffix={currency}
      />
      <StreamingPaymentsTable />
    </ContentWithTeamFilter>
  );
};

StreamingPaymentsPage.displayName = displayName;

export default StreamingPaymentsPage;
