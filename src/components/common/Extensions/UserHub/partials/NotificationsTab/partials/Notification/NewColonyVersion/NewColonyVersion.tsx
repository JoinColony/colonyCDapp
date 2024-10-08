import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { type NotificationColonyFragment } from '~gql';
import { COLONY_ADVANCED_ROUTE } from '~routes';
import { type Notification as NotificationInterface } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';
import NotificationWrapper from '../NotificationWrapper.tsx';

const displayName =
  'common.Extensions.UserHub.partials.NewColonyVersionNotification';

interface NewColonyVersionNotificationProps {
  colony: NotificationColonyFragment | null | undefined;
  loadingColony: boolean;
  notification: NotificationInterface;
}

const MSG = defineMessages({
  newColonyVersion: {
    id: `${displayName}.newColonyVersion`,
    defaultMessage: 'A new colony version ({version}) is available.',
  },
});

const NewColonyVersionNotification: FC<NewColonyVersionNotificationProps> = ({
  colony,
  loadingColony,
  notification,
}) => {
  const navigate = useNavigate();
  const { newColonyVersion } = notification.customAttributes || {};

  const handleNotificationClicked = () => {
    if (colony) {
      navigate(`/${colony.name}/${COLONY_ADVANCED_ROUTE}`);
    }
  };

  return (
    <NotificationWrapper
      colony={colony}
      loadingColony={loadingColony}
      notification={notification}
      onClick={handleNotificationClicked}
    >
      <NotificationMessage loading={loadingColony}>
        {formatText(MSG.newColonyVersion, { version: newColonyVersion })}
      </NotificationMessage>
    </NotificationWrapper>
  );
};

NewColonyVersionNotification.displayName = displayName;
export default NewColonyVersionNotification;
