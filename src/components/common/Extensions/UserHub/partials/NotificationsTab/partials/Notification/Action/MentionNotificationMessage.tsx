import React, { type FC, useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';
import { type BaseNotificationMessageProps } from '../types.ts';

interface MentionNotificationMessageProps extends BaseNotificationMessageProps {
  creator: string;
}
const displayName =
  'common.Extensions.UserHub.partials.MentionNotificationMessage';

const MSG = defineMessages({
  mention: {
    id: `${displayName}.mention`,
    defaultMessage: '{name} has mentioned you in: ',
  },
  someone: {
    id: `${displayName}.someone`,
    defaultMessage: 'Someone',
  },
  unknownAction: {
    id: `${displayName}.unknownAction`,
    defaultMessage: 'Unknown action',
  },
});

export const MentionNotificationMessage: FC<
  MentionNotificationMessageProps
> = ({ actionMetadataDescription, actionTitle, loading, creator }) => {
  const Message = useMemo(() => {
    const secondPart =
      actionTitle || actionMetadataDescription || formatText(MSG.unknownAction);

    return (
      <>
        {formatText(MSG.mention, {
          name: creator || formatText(MSG.someone),
        })}{' '}
        {secondPart}
      </>
    );
  }, [actionMetadataDescription, actionTitle, creator]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};
