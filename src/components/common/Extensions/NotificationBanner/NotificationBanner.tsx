import clsx from 'clsx';
import React, { FC, PropsWithChildren } from 'react';
import CopyUrl from './CopyUrl';
import { NotificationBannerProps } from './types';
import Link from '~shared/Link';
import Icon from '~shared/Icon';
import styles from './NotificationBanner.module.css';

const displayName = 'common.Extensions.NotificationBanner';

const NotificationBanner: FC<PropsWithChildren<NotificationBannerProps>> = ({
  status,
  title,
  children,
  actionText,
  actionType,
  isAlt = false,
}) => {
  // @TODO: handle actionType 'call-to-action'
  return (
    <div
      className={clsx(
        styles.banner,
        `text-gray-900 ${isAlt ? 'rounded min-h-[3.75rem] p-4' : 'rounded-lg min-h-[2.75rem] py-3 px-6 '}`,
        {
          'bg-success-100 border-success-200': status === 'success',
          'bg-warning-100 border-warning-200': status === 'warning',
          'bg-negative-100 border-negative-200': status === 'error',
          'text-success-400': isAlt && status === 'success',
          'text-warning-400': isAlt && status === 'warning',
          'text-negative-400': isAlt && status === 'error',
        },
      )}
    >
      <div className={clsx('flex break-all flex-col', { 'flex-row': !children || isAlt })}>
        <div className="flex md:items-center">
          {!isAlt && (
            <Icon
              name={status === 'success' ? 'check-circle' : 'warning-circle'}
              className={clsx('min-w-[0.875rem] min-h-[0.875rem] mt-[0.125rem] md:mt-0', {
                'text-success-400': status === 'success',
                'text-warning-400': status === 'warning',
                'text-negative-400': status === 'error',
              })}
            />
          )}
          <div className={`font-normal ${isAlt ? 'text-sm' : 'text-md ml-2'}`}>{title}</div>
        </div>
        {children && (
          <div className="text-sm font-normal text-gray-900 max-w-[50rem] ml-6 md:ml-0 mt-1.5">{children}</div>
        )}
      </div>
      <div className={clsx(styles.actionWrapper, { 'ml-0 md:ml-0 md:self-center': isAlt, 'ml-6 md:ml-2': !isAlt })}>
        {actionType === 'copy-url' && <CopyUrl actionText={actionText} />}
        {actionType === 'redirect' && <Link to="https://external-url.pl">{actionText}</Link>}
        {actionType === 'call-to-action' && actionText}
      </div>
    </div>
  );
};

NotificationBanner.displayName = displayName;

export default NotificationBanner;
