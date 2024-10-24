import {
  type IRemoteNotification,
  useNotification,
} from '@magicbell/react-headless';
import clsx from 'clsx';
import React, { type ReactNode, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { ADDRESS_ZERO } from '~constants';
import { type NotificationColonyFragment } from '~gql';
import { type Notification as NotificationInterface } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';
import RelativeDate from '~v5/shared/RelativeDate/index.ts';

const displayName = 'common.Extensions.UserHub.partials.NotificationWrapper';

const MSG = defineMessages({
  unknownColony: {
    id: `${displayName}.unknownColony`,
    defaultMessage: 'Unknown colony',
  },
});

interface NotificationWrapperProps {
  children: ReactNode;
  colony: NotificationColonyFragment | null | undefined;
  loadingColony: boolean;
  notification: NotificationInterface;
  onClick?: () => void;
}

const NotificationWrapper: FC<NotificationWrapperProps> = ({
  children,
  colony,
  loadingColony,
  notification,
  onClick,
}) => {
  const { markAsRead } = useNotification(notification as IRemoteNotification);

  const handleNotificationClicked = () => {
    if (!notification.readAt) {
      markAsRead();
    }
    onClick?.();
  };

  return (
    <li className="w-full ">
      <button
        className="relative flex w-full gap-2 px-6 py-3.5 text-left sm:hover:bg-gray-50"
        onClick={handleNotificationClicked}
        type="button"
      >
        <ColonyAvatar
          size={20}
          colonyAddress={colony?.colonyAddress || ADDRESS_ZERO}
          colonyImageSrc={
            colony?.metadata?.avatar || colony?.metadata?.thumbnail || undefined
          }
          colonyName={colony?.name || formatText(MSG.unknownColony)}
          className={
            loadingColony ? 'overflow-hidden rounded-full skeleton' : undefined
          }
        />
        <div
          className={clsx('w-full flex-col', {
            skeleton: loadingColony,
          })}
        >
          <div className="relative flex items-center gap-2">
            {!notification.readAt && (
              <div className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-base-white bg-blue-400" />
            )}
            <p className="text-md font-medium">
              {colony?.metadata?.displayName || formatText(MSG.unknownColony)}
            </p>
            <p className="text-xs text-gray-400">
              <RelativeDate value={(notification.sentAt || 0) * 1000} />
            </p>
          </div>
          {children}
        </div>
      </button>
    </li>
  );
};

NotificationWrapper.displayName = displayName;

export default NotificationWrapper;
