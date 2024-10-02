import {
  type IRemoteNotification,
  useNotification,
} from '@magicbell/react-headless';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { ADDRESS_ZERO } from '~constants';
import { useGetColonyActionQuery } from '~gql';
import { TX_SEARCH_PARAM } from '~routes';
import { type Notification as NotificationInterface } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';
import ColonyAvatar from '~v5/shared/ColonyAvatar/index.ts';
import RelativeDate from '~v5/shared/RelativeDate/index.ts';

import NotificationMessage from './NotificationMessage.tsx';

const displayName = 'common.Extensions.UserHub.partials.Notification';

const MSG = defineMessages({
  unknownAction: {
    id: `${displayName}.unknownAction`,
    defaultMessage: 'Unknown action',
  },
  unknownColony: {
    id: `${displayName}.unknownColony`,
    defaultMessage: 'Unknown colony',
  },
});

interface NotificationProps {
  notification: NotificationInterface;
}

const Notification: FC<NotificationProps> = ({ notification }) => {
  const navigate = useNavigate();
  const { markAsRead } = useNotification(notification as IRemoteNotification);

  const transactionHash = notification.customAttributes?.transactionHash;

  const { data: actionData, loading: loadingAction } = useGetColonyActionQuery({
    variables: {
      transactionHash: transactionHash || '',
    },
    skip: !transactionHash,
  });

  const action = actionData?.getColonyAction;
  const colony = action?.colony;

  const handleNotificationClicked = () => {
    if (!notification.readAt) {
      markAsRead();
    }

    if (transactionHash) {
      navigate(
        `${window.location.pathname}?${TX_SEARCH_PARAM}=${transactionHash}`,
        {
          replace: true,
        },
      );
    }
  };

  return (
    <li className="w-full py-3.5 first-of-type:pt-0">
      <button
        className={clsx('relative  flex w-full gap-2 text-left', {
          skeleton: loadingAction,
        })}
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
        />
        <div className=" w-full flex-col">
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
          {action ? (
            <NotificationMessage action={action} notification={notification} />
          ) : (
            <p className="text-xs font-normal text-gray-600">
              {formatText(MSG.unknownAction)}
            </p>
          )}
        </div>
      </button>
    </li>
  );
};

Notification.displayName = displayName;

export default Notification;
