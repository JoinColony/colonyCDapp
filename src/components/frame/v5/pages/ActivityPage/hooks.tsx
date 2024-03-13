import {
  CalendarCheck,
  HourglassMedium,
  UsersThree,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import { useActivityData } from '~hooks/useActivityData.ts';
import { formatText } from '~utils/intl.ts';
import { type WidthBoxItem } from '~v5/common/WidgetBoxList/types.ts';

const getFormattedActionsCount = (count: number) =>
  count > 1000 ? '999+' : count;

export const useActivityFeedWidgets = (): WidthBoxItem[] => {
  const {
    totalActions,
    recentActions,
    mostActiveDomainName,
    totalActionsLoading,
    recentActionsLoading,
  } = useActivityData();

  const tileClassName = 'text-gray-600';
  const contentClassName =
    'flex flex-row-reverse items-center gap-1.5 text-right sm:text-left sm:gap-0.5 sm:flex-col sm:items-start';

  const countSkeleton = (
    <div className="my-[0.25em] h-[1em] w-[60px] skeleton" />
  );

  return [
    {
      key: '1',
      title: formatText({ id: 'widget.totalActions' }),
      value: (
        <span className="text-gray-900 heading-4">
          {totalActionsLoading
            ? countSkeleton
            : getFormattedActionsCount(totalActions)}
        </span>
      ),
      className: tileClassName,
      icon: HourglassMedium,
      contentClassName,
    },
    {
      key: '2',
      title: formatText({ id: 'activityPage.recentActions' }),
      value: (
        <span className="text-gray-900 heading-4">
          {recentActionsLoading
            ? countSkeleton
            : formatText(
                { id: 'activityPage.recentActions.pastMonth' },
                {
                  value: getFormattedActionsCount(recentActions),
                  span: (chunks) => (
                    <span className="hidden text-1 sm:inline">{chunks}</span>
                  ),
                },
              )}
        </span>
      ),
      className: tileClassName,
      icon: CalendarCheck,
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
        <span className="inline-block overflow-hidden truncate whitespace-nowrap text-gray-900 heading-4">
          {mostActiveDomainName}
        </span>
      ),
      className: clsx(tileClassName, '[&_h3]:flex-shrink-0'),
      icon: UsersThree,
      contentClassName,
    },
  ];
};
