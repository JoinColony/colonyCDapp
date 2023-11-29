import clsx from 'clsx';
import React from 'react';
import { subDays, startOfDay } from 'date-fns';

import { notNull } from '~utils/arrays';
import {
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

  const { data: totalActionData } = useGetTotalColonyActionsQuery({
    variables: {
      filter: {
        colonyId: { eq: colonyAddress },
        showInActionsList: {
          eq: true,
        },
        colonyDecisionId: {
          exists: false,
        },
      },
    },
  });

  const totalActions = totalActionData?.searchColonyActions?.total ?? 0;

  const { data: recentActionData } = useGetTotalColonyActionsQuery({
    variables: {
      filter: {
        colonyId: { eq: colonyAddress },
        showInActionsList: {
          eq: true,
        },
        colonyDecisionId: {
          exists: false,
        },
        createdAt: { gte: getThirtyDaysAgoIso() },
      },
    },
  });

  const recentActions = recentActionData?.searchColonyActions?.total ?? 0;

  const { data: domainData } = useGetTotalColonyDomainActionsQuery({
    variables: {
      colonyId: colonyAddress,
    },
  });

  const domainsActionCount =
    // Buckets exists on this type but for some reason typescript is not
    // recognising this
    // @ts-ignore
    domainData?.searchColonyActions?.aggregateItems[0]?.result?.buckets ?? [];

  const domainWithMaxActions = domainsActionCount.reduce(
    (max, item) => (item.doc_count > (max?.doc_count ?? 0) ? item : max),
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
          {totalActions > 1000 ? '999+' : totalActions}
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
              value: recentActions > 1000 ? '999+' : recentActions,
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
