import { getExtensionHash } from '@colony/colony-js';
import React, { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { supportedExtensionsConfig } from '~constants';
import {
  type NotificationColonyFragment,
  useGetUserByAddressQuery,
} from '~gql';
import { COLONY_EXTENSIONS_ROUTE } from '~routes';
import { type Notification as NotificationInterface } from '~types/notifications.ts';

import NotificationWrapper from '../NotificationWrapper.tsx';

import ExtensionNotificationMessage from './ExtensionNotificationMessage.tsx';

const displayName = 'common.Extensions.UserHub.partials.ExtensionNotification';

interface NotificationProps {
  colony: NotificationColonyFragment | null | undefined;
  loadingColony: boolean;
  notification: NotificationInterface;
  closeUserHub: () => void;
}

const getExtensionByHash = (extensionHash?: string) => {
  if (!extensionHash) {
    return undefined;
  }

  const extensionsWithHash = supportedExtensionsConfig.map((extension) => {
    return {
      ...extension,
      hash: getExtensionHash(extension.extensionId),
    };
  });

  const extension = extensionsWithHash.find(
    (extensionWithHash) => extensionWithHash.hash === extensionHash,
  );

  return extension;
};

const ExtensionNotification: FC<NotificationProps> = ({
  colony,
  loadingColony,
  notification,
  closeUserHub,
}) => {
  const navigate = useNavigate();

  const { creator, extensionHash } = notification.customAttributes || {};

  const { data: userData, loading: loadingUser } = useGetUserByAddressQuery({
    variables: { address: creator || '' },
    skip: !creator,
  });

  const extension = getExtensionByHash(extensionHash);

  const creatorName =
    userData?.getUserByAddress?.items[0]?.profile?.displayName ?? '';

  const handleNotificationClicked = () => {
    if (colony && extension) {
      navigate(
        `/${colony.name}/${COLONY_EXTENSIONS_ROUTE}/${extension.extensionId}`,
        {
          replace: true,
        },
      );
      closeUserHub();
    }
  };

  return (
    <NotificationWrapper
      colony={colony}
      loadingColony={loadingColony}
      notification={notification}
      onClick={handleNotificationClicked}
    >
      <ExtensionNotificationMessage
        creator={creatorName}
        extensionName={extension?.name}
        loading={loadingUser}
        notification={notification}
      />
    </NotificationWrapper>
  );
};

ExtensionNotification.displayName = displayName;

export default ExtensionNotification;
