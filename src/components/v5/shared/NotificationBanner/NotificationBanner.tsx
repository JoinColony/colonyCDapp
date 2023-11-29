import React, { FC } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { NotificationBannerProps } from './types';

const displayName = 'common.Extensions.NotificationBanner';

const NotificationBanner: FC<NotificationBannerProps> = ({
  className,
  status,
  icon,
  children,
  description,
  callToAction,
}) => {
  return (
    <div
      className={clsx(
        '@container/notificationBanner border rounded-lg py-3 px-[1.125rem] flex gap-2 flex-row items-start text-gray-900',
        {
          'bg-success-100 border-success-200': status === 'success',
          'bg-warning-100 border-warning-200': status === 'warning',
          'bg-negative-100 border-negative-200': status === 'error',
          'bg-gray-50 border-gray-200': status === 'info',
        },
        className,
      )}
    >
      {icon ? (
        <Icon
          appearance={{ size: 'extraSmall' }}
          name={icon}
          className={clsx('flex-shrink-0 translate-y-0.5', {
            // due to line height, the text has top padding, then this doesn't look centered, hence the 2px translate down the y axis
            'text-success-400': status === 'success',
            'text-warning-400': status === 'warning',
            'text-negative-400': status === 'error',
            'text-gray-900': status === 'info',
            hidden: true,
          })}
        />
      ) : null}
      <div className="flex flex-1 gap-2 flex-col items-start @[600px]/notificationBanner:flex-row @[600px]/notificationBanner:items-center">
        <div className="flex flex-1 flex-col gap-1 items-start text-md">
          {children}
          {description ? (
            <div className="text-sm text-gray-900">{description}</div>
          ) : null}
        </div>
        {callToAction ? (
          <div
            className={clsx(
              'flex-shrink-0 underline font-medium text-xs md:hover:no-underline',
            )}
          >
            {callToAction}
          </div>
        ) : null}
      </div>
    </div>
  );
};

NotificationBanner.displayName = displayName;

export default NotificationBanner;
