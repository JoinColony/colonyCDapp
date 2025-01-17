import { Extension } from '@colony/colony-js';
import React from 'react';

import { currencySymbolMap } from '~constants/currency.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { useStreamingPaymentsTotalFunds } from '~shared/StreamingPayments/hooks.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import ContentWithTeamFilter from '~v5/frame/ContentWithTeamFilter/ContentWithTeamFilter.tsx';

import NoExtensionBanner from './partials/NoExtensionBanner/NoExtensionBanner.tsx';
import StatsCards from './partials/StatsCards/StatsCards.tsx';

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

  const { extensionData } = useExtensionData(Extension.StreamingPayments);
  const isStreamingPaymentsInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  const isStreamingPaymentsDisabled =
    !!extensionData && !isStreamingPaymentsInstalled;

  return (
    <ContentWithTeamFilter>
      <div className="pb-9">
        <StatsCards
          streamingPerMonth={totalLastMonthStreaming}
          totalActiveStreams={activeStreamingPayments}
          totalStreamed={totalStreamed}
          unclaimedFounds={totalFunds.totalAvailable}
          prefix={currencySymbolMap[currency]}
          suffix={currency}
        />
      </div>
      {isStreamingPaymentsDisabled && (
        <div className="pb-9">
          <NoExtensionBanner />
        </div>
      )}
    </ContentWithTeamFilter>
  );
};

StreamingPaymentsPage.displayName = displayName;

export default StreamingPaymentsPage;
