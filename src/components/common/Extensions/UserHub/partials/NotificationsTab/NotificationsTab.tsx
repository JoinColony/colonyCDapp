import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { AnimatePresence, motion } from 'framer-motion';

import NotificationsItems from './partials/NotificationsTabItem';
import { useColonyContext, useMobile } from '~hooks';
import EmptyContent from '~v5/common/EmptyContent';
import { useNotifications } from '~hooks/useNotifications';

const displayName = 'common.Extensions.UserHub.partials.NotificationsTab';

const NotificationsTab: FC = () => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { colonyAddress } = colony || {};

  const { notifications, subscribeToColony } = useNotifications();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="heading-5">{formatMessage({ id: 'notifications' })}</p>
        {!isMobile && (
          <button
            type="button"
            className="text-blue-400 text-4 hover:text-gray-900 transition-all duration-normal"
            aria-label={formatMessage({ id: 'markAllAsRead' })}
          >
            {/* @TODO handle action here */}
            {formatMessage({ id: 'markAllAsRead' })}
          </button>
        )}
        <button
          type="button"
          className="text-blue-400 text-4 hover:text-gray-900 transition-all duration-normal"
          onClick={() => {
            subscribeToColony(colonyAddress || '', true);
          }}
        >
          Subscribe to colony
        </button>
        <button
          type="button"
          className="text-blue-400 text-4 hover:text-gray-900 transition-all duration-normal"
          onClick={() => {
            subscribeToColony(colonyAddress || '', false);
          }}
        >
          UnSubscribe to colony
        </button>
      </div>
      <ul className="flex flex-col">
        <AnimatePresence>
          <motion.div
            key="notifications-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {notifications.length ? (
              notifications.map(
                ({
                  title,
                  text,
                  createdAt,
                  read,
                  colony: notificationColony,
                }) => {
                  const notificationTitle =
                    title ||
                    notificationColony?.metadata?.displayName ||
                    notificationColony?.name ||
                    notificationColony?.id ||
                    'Colony Notification';
                  return (
                    <NotificationsItems
                      title={notificationTitle}
                      date={createdAt}
                      text={text}
                      read={read}
                      key={createdAt}
                    />
                  );
                },
              )
            ) : (
              <EmptyContent
                title={{ id: 'empty.content.title.notifications' }}
                description={{ id: 'empty.content.subtitle.notifications' }}
                icon="envelope"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </ul>
    </div>
  );
};

NotificationsTab.displayName = displayName;

export default NotificationsTab;
