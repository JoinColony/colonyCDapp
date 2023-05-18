import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';
import CopyUrl from './CopyUrl';
import { NotificationBannerProps } from './NotificationBanner.types';
import Link from '~shared/Link';
import Icon from '~shared/Icon';

const displayName = 'common.Extensions.NotificationBanner';

const NotificationBanner: FC<PropsWithChildren<NotificationBannerProps>> = ({
  status,
  title,
  children,
  actionText,
  actionType,
}) => {
  // @TODO: handle actionType 'call-to-action'
  return (
    <div
      className={clsx(
        `py-3 px-6 border border-solid rounded-lg flex justify-between min-h-[2.75rem] flex-col md:flex-row md:items-center`,
        {
          'bg-success-100 border-success-200': status === 'success',
          'bg-warning-100 border-warning-200': status === 'warning',
          'bg-negative-100 border-negative-200': status === 'error',
        },
      )}
    >
      <div className={clsx('flex', { 'flex-col': children, 'flex-row': !children })}>
        <div className="flex md:items-center">
          <Icon
            name={status === 'success' ? 'check-circle' : 'warning-circle'}
            className={clsx('min-w-[0.875rem] min-h-[0.875rem]', {
              'text-success-400 mt-[0.125rem] md:mt-0': status === 'success',
              'text-warning-400 mt-[0.225rem] md:mt-0': status === 'warning',
              'text-negative-400 mt-[0.225rem] md:mt-0': status === 'error',
            })}
          />
          <div className="text-md font-normal text-gray-900 ml-2">{title}</div>
        </div>
        {children && <div className="text-sm font-normal text-gray-900 max-w-[50rem] ml-6 md:ml-0">{children}</div>}
      </div>
      <div className="underline text-xs font-medium mt-2 ml-6 md:mt-0 md:ml-0 text-gray-900">
        {actionType === 'copy-url' && <CopyUrl actionText={actionText} />}
        {actionType === 'redirect' && (
          <Link className="text-gray-900" to="https://external-url.pl">
            {actionText}
          </Link>
        )}
        {actionType === 'call-to-action' && actionText}
      </div>
    </div>
  );
};

NotificationBanner.displayName = displayName;

export default NotificationBanner;
