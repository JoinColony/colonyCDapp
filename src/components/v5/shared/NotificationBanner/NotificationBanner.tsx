import clsx from 'clsx';
import React, { type FC } from 'react';

import { type NotificationBannerProps } from './types.ts';

const displayName = 'v5.NotificationBanner';

const NotificationBanner: FC<NotificationBannerProps> = ({
  className,
  status,
  icon: Icon,
  iconSize = 16,
  children,
  description,
  callToAction,
  descriptionClassName,
  callToActionClassName,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-row items-start gap-2 rounded-lg border px-[1.125rem] py-3 text-gray-900 @container/notificationBanner',
        {
          'border-success-200 bg-success-100': status === 'success',
          'border-warning-200 bg-warning-100': status === 'warning',
          'border-negative-200 bg-negative-100': status === 'error',
          'border-gray-200 bg-gray-50': status === 'info',
        },
        className,
      )}
    >
      {Icon ? (
        <Icon
          size={iconSize}
          className={clsx('flex-shrink-0 translate-y-0.5', {
            // due to line height, the text has top padding, then this doesn't look centered, hence the 2px translate down the y axis
            'text-success-400': status === 'success',
            'text-warning-400': status === 'warning',
            'text-negative-400': status === 'error',
            'text-gray-900': status === 'info',
          })}
        />
      ) : null}
      <div className="flex flex-1 flex-col items-start gap-2 @[600px]/notificationBanner:flex-row @[600px]/notificationBanner:items-center">
        <div className="flex flex-1 flex-col items-start gap-2 text-md break-word">
          {children}
          {description ? (
            <div
              className={clsx(descriptionClassName, 'text-sm text-gray-900')}
            >
              {description}
            </div>
          ) : null}
        </div>
        {callToAction ? (
          <div
            className={clsx(
              'flex-shrink-0 text-xs font-medium underline underline-offset-2 md:hover:no-underline',
              callToActionClassName,
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
