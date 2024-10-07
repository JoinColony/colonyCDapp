import clsx from 'clsx';
import React, { type ReactNode, type FC } from 'react';

const displayName = 'common.Extensions.UserHub.partials.NotificationMessage';

interface NotificationMessageProps {
  children: ReactNode;
  loading?: boolean;
}

const NotificationMessage: FC<NotificationMessageProps> = ({
  children,
  loading,
}) => {
  return (
    <p
      className={clsx('text-xs font-normal text-gray-600', {
        skeleton: loading,
      })}
    >
      {children}
    </p>
  );
};

NotificationMessage.displayName = displayName;

export default NotificationMessage;
