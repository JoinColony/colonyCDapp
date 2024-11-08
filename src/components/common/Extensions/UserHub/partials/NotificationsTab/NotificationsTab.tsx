import { Binoculars } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useRef } from 'react';
import { defineMessages } from 'react-intl';

import { useNotificationsDataContext } from '~context/Notifications/NotificationsDataContext/NotificationsDataContext.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';
import InfiniteScrollTrigger from '~v5/common/InfiniteScrollTrigger/InfiniteScrollTrigger.tsx';

import NotificationsList from './partials/NotificationsList.tsx';

const displayName = 'common.Extensions.UserHub.partials.NotificationsTab';

const MSG = defineMessages({
  notifications: {
    id: `${displayName}.notifications`,
    defaultMessage: 'Notifications',
  },
  emptyTitle: {
    id: `${displayName}.emptyTitle`,
    defaultMessage: 'No notifications yet',
  },
  emptyDescription: {
    id: `${displayName}.emptyDescription`,
    defaultMessage: 'Your notifications will appear here.',
  },
  new: {
    id: `${displayName}.new`,
    defaultMessage: 'new',
  },
  markAllAsRead: {
    id: `${displayName}.markAllAsRead`,
    defaultMessage: 'Mark all as read',
  },
});

const NotificationsTab = ({ closeUserHub }: { closeUserHub: () => void }) => {
  const { canFetchMore, fetchMore, markAllAsRead, notifications, unreadCount } =
    useNotificationsDataContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const isEmpty = notifications.length === 0;

  const hasUnreadNotifications = !!unreadCount && unreadCount > 0;

  let cappedCount: string | number = unreadCount ?? 0;
  const maximum = 99;

  if (!!unreadCount && unreadCount > maximum) {
    cappedCount = `${maximum}+`;
  }

  return (
    <div
      className={clsx('h-full pb-6 pt-6 sm:pb-2', {
        'overflow-auto': !isEmpty,
      })}
      ref={containerRef}
    >
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center">
          <p className="heading-5">{formatText(MSG.notifications)}</p>
          {hasUnreadNotifications && (
            <p className="ml-2 h-fit rounded-sm bg-blue-100 px-[3px] py-[2.5px] text-[8px] font-bold text-blue-400">
              {cappedCount} {formatText(MSG.new)}
            </p>
          )}
        </div>
        {hasUnreadNotifications && markAllAsRead && (
          <button
            onClick={() => markAllAsRead()}
            className="text-xs font-medium text-blue-400"
            type="button"
          >
            {formatText(MSG.markAllAsRead)}
          </button>
        )}
      </div>
      <div
        className={clsx(
          'flex flex-col justify-center pt-0.5 sm:justify-normal',
          {
            'h-full sm:h-auto': isEmpty,
          },
        )}
      >
        {isEmpty ? (
          <>
            <EmptyContent
              title={formatText(MSG.emptyTitle)}
              description={formatText(MSG.emptyDescription)}
              icon={Binoculars}
              className="sm:pt-[100px]"
            />
            <div className="h-[25%] sm:h-0" />
          </>
        ) : (
          <>
            <NotificationsList closeUserHub={closeUserHub} />
            <InfiniteScrollTrigger
              canFetchMore={canFetchMore}
              containerRef={containerRef}
              fetchMore={fetchMore}
            />
          </>
        )}
      </div>
    </div>
  );
};

NotificationsTab.displayName = displayName;

export default NotificationsTab;
