import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import Link from '~v5/shared/Link';

import CopyUrl from './CopyUrl';
import { NotificationBannerProps } from './types';
import StatusText from '~v5/shared/StatusText';

const displayName = 'common.Extensions.NotificationBanner';

const NotificationBanner: FC<PropsWithChildren<NotificationBannerProps>> = ({
  status,
  title,
  children,
  action,
  isAlt = false,
  className,
  textAlign = 'center',
}) => {
  const { actionText } = action || {};

  return (
    <div
      className={clsx(
        className,
        'border rounded-lg flex justify-between min-h-[2.75rem] flex-col',
        `gap-2 ${
          isAlt
            ? 'rounded min-h-[3.75rem] p-4'
            : 'rounded-lg min-h-[2.75rem] py-3 px-6'
        }`,
        {
          'bg-success-100 border-success-200': status === 'success',
          'bg-warning-100 border-warning-200': status === 'warning',
          'bg-negative-100 border-negative-200': status === 'error',
          'bg-gray-50 border-gray-200 text-gray-600 text-sm': status === 'info',
          'text-success-400': isAlt && status === 'success',
          'text-warning-400': isAlt && status === 'warning',
          'text-negative-400': isAlt && status === 'error',
        },
      )}
    >
      <div
        className={clsx('flex flex-col', {
          'flex-row': !children || isAlt,
        })}
      >
        <div className="flex md:items-center">
          <StatusText
            status={status}
            withIcon={!isAlt}
            textClassName={isAlt ? 'text-sm' : undefined}
          >
            {title}
          </StatusText>
        </div>
        {children && (
          <div
            className={clsx('text-sm max-w-[50rem] mt-1.5', {
              'text-negative-400': status === 'error',
              'text-warning-400': status === 'warning',
            })}
          >
            {children}
          </div>
        )}
      </div>
      {action && (
        <div
          className={clsx('mt-2 md:mt-0 text-4', {
            'md:self-center': textAlign === 'center',
            'md:self-start': textAlign === 'left',
            'ml-6 md:ml-2': !isAlt,
          })}
        >
          {(() => {
            switch (action?.type) {
              case 'copy': {
                return <CopyUrl actionText={action.copyContent} />;
              }
              case 'redirect': {
                return (
                  <Link
                    to={action.href}
                    className="underline md:hover:no-underline"
                  >
                    {actionText}
                  </Link>
                );
              }
              case 'call-to-action': {
                return (
                  <button
                    type="button"
                    className="underline md:hover:no-underline"
                    onClick={action.onClick}
                  >
                    {actionText}
                  </button>
                );
              }
              default:
                return null;
            }
          })()}
        </div>
      )}
    </div>
  );
};

NotificationBanner.displayName = displayName;

export default NotificationBanner;
