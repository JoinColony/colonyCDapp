import clsx from 'clsx';
import React from 'react';
import { subDays, startOfDay } from 'date-fns';

import {
  useGetActiveMotionsQuery,
  useGetTotalColonyActionsQuery,
  useGetTotalColonyDomainActionsQuery,
} from '~gql';
import { formatText } from '~utils/intl';
import { WidthBoxItem } from '~v5/common/WidgetBoxList/types';
import { useColonyContext } from '~hooks';

const getThirtyDaysAgoIso = () => {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const midnightThirtyDaysAgo = startOfDay(thirtyDaysAgo);
  return midnightThirtyDaysAgo.toISOString();
};

export const useActivityFeedWidgets = (): WidthBoxItem[] => {
  const { colony } = useColonyContext();
  const { domains, colonyAddress = '' } = colony ?? {};
  const { data: motionData } = useGetActiveMotionsQuery({
    variables: {
      colonyId: colonyAddress ?? '',
    },
  });

  const activeActionsNumber = motionData?.getActiveMotions?.total ?? 0;

  const { data: actionData } = useGetTotalColonyActionsQuery({
    variables: {
      colonyId: colonyAddress ?? '',
      since: getThirtyDaysAgoIso(),
    },
  });

  const recentActionsCount = actionData?.searchColonyActions?.total ?? 0;

  const { data: domainData } = useGetTotalColonyDomainActionsQuery({
    variables: {
      colonyId: colonyAddress ?? '',
    },
  });

  const domainsActionCount =
    domainData?.searchColonyActions?.aggregateItems?.[0]?.result?.buckets ?? [];

  const domainWithMaxActions = domainsActionCount.reduce(
    (max, item) => (item.doc_count > (max?.doc_count ?? 0) ? item : max),
    null,
  );

  const mostActiveDomain = domains?.items?.find(
    (domain) => domain.id === domainWithMaxActions?.key || '',
  );

  const mostActiveDomainName = mostActiveDomain?.metadata?.name || '~';

  const tileClassName = 'text-gray-400';
  const contentClassName =
    'flex flex-row-reverse items-center gap-1.5 text-right sm:text-left sm:gap-0 sm:flex-col sm:items-start';

  return [
    {
      key: '1',
      title: formatText({ id: 'activityPage.activeActions' }),
      value: (
        <span className="heading-4 text-gray-900">
          {activeActionsNumber > 1000 ? '999+' : activeActionsNumber}
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
              value: recentActionsCount > 1000 ? '999+' : recentActionsCount,
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
