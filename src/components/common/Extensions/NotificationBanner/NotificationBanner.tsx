import React, { FC } from 'react';
import clsx from 'clsx';

import { NotificationBannerProps } from './types';
import Icon from '~shared/Icon';

const displayName = 'common.Extensions.NotificationBanner';

const NotificationBanner: FC<NotificationBannerProps> = ({
  className,
  isAlt = false,
  status,
  icon,
  children,
  description,
  callToAction,
}) => {
  return (
    <div className="@container/notificationBanner">
      <div
        className={clsx(
          'border rounded-lg flex gap-2 justify-between flex-col items-start @[600px]/notificationBanner:flex-row @[600px]/notificationBanner:items-center text-gray-900',
          isAlt ? 'rounded p-4' : 'rounded-lg py-3 px-6',
          {
            'bg-success-100 border-success-200-200': status === 'success',
            'bg-warning-100 border-warning-200': status === 'warning',
            'bg-negative-100 border-negative-200': status === 'error',
            'bg-gray-50 border-gray-200': status === 'info',
          },
          className,
        )}
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-2 items-center text-md">
            {icon ? (
              <Icon
                appearance={{ size: 'extraSmall' }}
                name={icon}
                className={clsx('flex-shrink-0', {
                  'text-success-400': status === 'success',
                  'text-warning-400': status === 'warning',
                  'text-negative-400': status === 'error',
                  'text-gray-900': status === 'info',
                })}
              />
            ) : null}
            {children}
          </div>
          {description ? (
            <div className="text-sm text-gray-600">{description}</div>
          ) : null}
        </div>
        {callToAction ? (
          <div
            className={clsx(
              'flex-shrink-0 underline font-medium text-xs @[600px]/notificationBanner:ml-0 md:hover:no-underline',
              !!icon && 'ml-[calc(1rem+8px)]', // if we have an icon we need to offset the CTA to align vertically to the main text
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
