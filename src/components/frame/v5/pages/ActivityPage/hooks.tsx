import clsx from 'clsx';
import React from 'react';

import { formatText } from '~utils/intl';
import { WidthBoxItem } from '~v5/common/WidgetBoxList/types';

export const useActivityFeedWidgets = (): WidthBoxItem[] => {
  const tileClassName = 'text-gray-400';
  const contentClassName =
    'flex flex-row-reverse items-center gap-1.5 text-right sm:text-left sm:gap-0 sm:flex-col sm:items-start';
  // @todo: replace with correct data
  const activeActionsNumber = 44;
  const recentActionsCount = 120;
  const mostActiveTeam = 'Product';

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
          {mostActiveTeam}
        </span>
      ),
      className: clsx(tileClassName, '[&_h3]:flex-shrink-0'),
      iconName: 'users-three',
      contentClassName,
    },
  ];
};
