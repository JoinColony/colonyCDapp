import React, { useMemo, type FC } from 'react';
import { type MessageDescriptor, defineMessages } from 'react-intl';

import { NotificationType } from '~gql';
import { type Notification } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.ExtensionNotificationMessage';

interface ExtensionNotificationMessageProps {
  creator?: string;
  extensionName?: MessageDescriptor;
  loading: boolean;
  notification: Notification;
}

const MSG = defineMessages({
  unknownExtensionName: {
    id: `${displayName}.unknown`,
    defaultMessage: 'Unknown',
  },
  someone: {
    id: `${displayName}.someone`,
    defaultMessage: 'Someone',
  },
  installed: {
    id: `${displayName}.installed`,
    defaultMessage: 'extension installed by {name}',
  },
  upgraded: {
    id: `${displayName}.upgraded`,
    defaultMessage: 'extension upgraded by {name}',
  },
  enabled: {
    id: `${displayName}.enabled`,
    defaultMessage: 'extension enabled by {name}',
  },
  deprecated: {
    id: `${displayName}.deprecated`,
    defaultMessage: 'extension deprecated by {name}',
  },
  uninstalled: {
    id: `${displayName}.uninstalled`,
    defaultMessage: 'extension uninstalled by {name}',
  },
  settingsChanged: {
    id: `${displayName}.settingsChanged`,
    defaultMessage: 'extension settings changed by {name}',
  },
});

const ExtensionNotificationMessage: FC<ExtensionNotificationMessageProps> = ({
  creator,
  extensionName,
  loading,
  notification,
}) => {
  const extensionNameDescriptor = extensionName ?? MSG.unknownExtensionName;

  const Message = useMemo(() => {
    if (!notification.customAttributes?.notificationType) {
      return null;
    }

    const { notificationType } = notification.customAttributes;

    const renderNotificationMessage = (message: MessageDescriptor) => (
      <>
        {formatMessage(extensionNameDescriptor)}{' '}
        {formatText(message, {
          name: creator || formatText(MSG.someone),
        })}
      </>
    );

    switch (notificationType) {
      case NotificationType.ExtensionInstalled:
        return renderNotificationMessage(MSG.installed);
      case NotificationType.ExtensionUpgraded:
        return renderNotificationMessage(MSG.upgraded);
      case NotificationType.ExtensionEnabled:
        return renderNotificationMessage(MSG.enabled);
      case NotificationType.ExtensionDeprecated:
        return renderNotificationMessage(MSG.deprecated);
      case NotificationType.ExtensionUninstalled:
        return renderNotificationMessage(MSG.uninstalled);
      case NotificationType.ExtensionSettingsChanged:
        return renderNotificationMessage(MSG.settingsChanged);
      default:
        return null;
    }
  }, [creator, notification.customAttributes, extensionNameDescriptor]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};

ExtensionNotificationMessage.displayName = displayName;

export default ExtensionNotificationMessage;
