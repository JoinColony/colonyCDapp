import { Extension } from '@colony/colony-js';
import React from 'react';
import { defineMessages } from 'react-intl';

import { useExtensionItem } from '~common/Extensions/ExtensionItem/hooks.ts';
import { Action } from '~constants/actions.ts';
import { currencySymbolMap } from '~constants/currency.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { useStreamingPaymentsTotalFunds } from '~shared/StreamingPayments/hooks.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import ContentWithTeamFilter from '~v5/frame/ContentWithTeamFilter/ContentWithTeamFilter.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import NoExtensionBanner from './partials/NoExtensionBanner/NoExtensionBanner.tsx';
import StatsCards from './partials/StatsCards/StatsCards.tsx';
import StreamingPaymentPageFilters from './partials/StreamingPaymentsTable/partials/StreamingPaymentFilters/StreamingPaymentFilters.tsx';
import StreamingPaymentsTable from './partials/StreamingPaymentsTable/StreamingPaymentsTable.tsx';

const displayName = 'v5.pages.StreamingPaymentsPage';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Streaming Payments',
  },
  createNewStream: {
    id: `${displayName}.createNewStream`,
    defaultMessage: 'Create new stream',
  },
});

const StreamingPaymentsPage = () => {
  useSetPageHeadingTitle(formatText({ id: 'streamingPaymentsPage.title' }));

  const nativeDomainId = useGetSelectedDomainFilter()?.nativeId;
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

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

  const { isExtensionInstalled, isExtensionDataLoading, status } =
    useExtensionItem(Extension.StreamingPayments);

  const isExtensionDisabled =
    status === 'deprecated' ||
    (!isExtensionInstalled && !isExtensionDataLoading);

  return (
    <ContentWithTeamFilter>
      <div className="pb-8">
        <StatsCards
          streamingPerMonth={totalLastMonthStreaming}
          totalActiveStreams={activeStreamingPayments}
          totalStreamed={totalStreamed}
          unclaimedFounds={totalFunds.totalAvailable}
          prefix={currencySymbolMap[currency]}
          suffix={currency}
        />
      </div>
      {isExtensionDisabled && (
        <div className="pb-9 pt-1">
          <NoExtensionBanner />
        </div>
      )}
      <div className="mb-3.5 flex-col justify-between sm:flex sm:flex-row sm:items-center">
        <div className="mb-2.5 flex items-center gap-2 sm:mb-0">
          <h4 className="heading-5">{formatText(MSG.title)}</h4>
        </div>
        <div className="flex items-center gap-2">
          <StreamingPaymentPageFilters />
          <Button
            mode="primarySolid"
            size="small"
            isFullSize={false}
            onClick={() => {
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: Action.StreamingPayment,
              });
            }}
            disabled={isExtensionDisabled}
          >
            {formatText(MSG.createNewStream)}
          </Button>
        </div>
      </div>
      <StreamingPaymentsTable />
    </ContentWithTeamFilter>
  );
};

StreamingPaymentsPage.displayName = displayName;

export default StreamingPaymentsPage;
