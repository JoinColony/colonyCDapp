import React, { type FC, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';
import { type BaseNotificationMessageProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.PermissionsNotificationMessage';

const MSG = defineMessages({
  actionCreated: {
    id: `${displayName}.actionCreated`,
    defaultMessage: 'Permissions used:',
  },
  unknownAction: {
    id: `${displayName}.unknownAction`,
    defaultMessage: 'Unknown action',
  },
});

export const PermissionsNotificationMessage: FC<
  BaseNotificationMessageProps
> = ({ actionMetadataDescription, actionTitle, loading }) => {
  const Message = useMemo(() => {
    const secondPart =
      actionTitle || actionMetadataDescription || formatText(MSG.unknownAction);

    return (
      <>
        {formatText(MSG.actionCreated)} {secondPart}
      </>
    );
  }, [actionMetadataDescription, actionTitle]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};
