import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';
import CopyUrl from './CopyUrl';
import { NotificationBannerProps } from './NotificationBanner.types';
import Link from '~shared/Link';

const displayName = 'common.Extensions.NotificationBanner';

const NotificationBanner: FC<PropsWithChildren<NotificationBannerProps>> = ({
  status,
  title,
  children,
  actionText,
  actionType,
  isFullSize = true,
}) => {
  // @TODO: handle actionType 'call-to-action'
  return (
    <div
      className={clsx('py-3 px-6 border border-solid rounded-lg flex justify-between', {
        'bg-success-100 border-success-100 h-[2.75rem]': status === 'success',
        'bg-warning-100 border-warning-100': status === 'warning',
        'bg-negative-100 border-negative-100': status === 'error',
        'w-full flex-row items-center': isFullSize,
        'max-w-[23.75rem] flex-col': !isFullSize,
      })}
    >
      <div className={clsx('flex', { 'flex-col': children, 'flex-row': !children })}>
        <div className="flex items-center">
          <div>*</div>
          <div className="text-md font-normal text-gray-900 ml-2">{title}</div>
        </div>
        {children && <div className="text-sm font-normal text-gray-600 max-w-[50rem]">{children}</div>}
      </div>
      <div className={clsx('underline text-xs font-medium', { 'mt-2 ml-4': !isFullSize })}>
        {actionType === 'copy-url' && <CopyUrl actionText={actionText} />}
        {actionType === 'redirect' && <Link to="https://external-url.pl">{actionText}</Link>}
        {actionType === 'call-to-action' && actionText}
      </div>
    </div>
  );
};

NotificationBanner.displayName = displayName;

export default NotificationBanner;
