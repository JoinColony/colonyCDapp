import clsx from 'clsx';
import React from 'react';

import { useGetTotalColonyDomainActionsQuery } from '~gql';
import {
  useActionsCount,
  useColonyContext,
  useGetSelectedDomainFilter,
} from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import { notNull } from '~utils/arrays';
import { formatText } from '~utils/intl';
import { WidthBoxItem } from '~v5/common/WidgetBoxList/types';

const getFormattedActionsCount = (count: number) =>
  count > 1000 ? '999+' : count;

export const useActivityFeedWidgets = (): WidthBoxItem[] => {
  const { colony } = useColonyContext();
  const { domains, colonyAddress = '' } = colony ?? {};
  const selectedDomain = useGetSelectedDomainFilter();

  const { actionsCount: totalActions, loading: totalActionsLoading } =
    useActionsCount({
      domainId: selectedDomain?.nativeId,
    });

  const { actionsCount: recentActions, loading: recentActionsLoading } =
    useActionsCount({
      domainId: selectedDomain?.nativeId,
      onlyRecent: true,
    });

  const { data: domainData } = useGetTotalColonyDomainActionsQuery({
    variables: {
      colonyId: colonyAddress,
    },
  });

  const domainCountsResult =
    domainData?.searchColonyActions?.aggregateItems[0]?.result || {};
  const domainsActionCount =
    // eslint-disable-next-line no-underscore-dangle
    domainCountsResult?.__typename === 'SearchableAggregateBucketResult'
      ? domainCountsResult?.buckets?.filter(notNull) ?? []
      : [];

  const domainWithMaxActions = domainsActionCount.reduce(
    (max, item) => (item.docCount > (max || 0) ? item : max),
    null,
  );

  const mostActiveDomain = domains?.items
    .filter(notNull)
    .find((domain) => domain.id === domainWithMaxActions?.key || '');

  const mostActiveDomainName = mostActiveDomain?.metadata?.name || '~';

  const tileClassName = 'text-gray-400';
  const contentClassName =
    'flex flex-row-reverse items-center gap-1.5 text-right sm:text-left sm:gap-0 sm:flex-col sm:items-start';

  return [
    {
      key: '1',
      title: formatText({ id: 'widget.totalActions' }),
      value: (
        <span className="heading-4 text-gray-900">
          {totalActionsLoading ? (
            <SpinnerLoader />
          ) : (
            getFormattedActionsCount(totalActions)
          )}
        </span>
      ),
      className: tileClassName,
      iconName: 'hourglass-medium',
      contentClassName,
    },
    {
      key: '2',
      title: formatText({ id: 'activityPage.recentActions' }),
      value: (
        <span className="heading-4 text-gray-900">
          {formatText(
            { id: 'activityPage.recentActions.pastMonth' },
            {
              value: recentActionsLoading ? (
                <SpinnerLoader />
              ) : (
                getFormattedActionsCount(recentActions)
              ),
              span: (chunks) => (
                <span className="text-1 hidden sm:inline">{chunks}</span>
              ),
            },
          )}
        </span>
      ),
      className: tileClassName,
      iconName: 'calendar-check',
      contentClassName,
    },
    {
      key: '3',
      title: formatText(
        { id: 'activityPage.mostActiveTeam' },
        {
          span: (chunks) => <span className="hidden sm:inline">{chunks}</span>,
        },
      ),
      value: (
        <span className="heading-4 text-gray-900 truncate whitespace-nowrap overflow-hidden inline-block">
          {mostActiveDomainName}
        </span>
      ),
      className: clsx(tileClassName, '[&_h3]:flex-shrink-0'),
      iconName: 'users-three',
      contentClassName,
    },
  ];
};
