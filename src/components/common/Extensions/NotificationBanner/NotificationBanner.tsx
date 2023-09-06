import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Link from '~v5/shared/Link';

import CopyUrl from './CopyUrl';
import styles from './NotificationBanner.module.css';
import { NotificationBannerProps } from './types';
import StatusText from '~v5/shared/StatusText';

const displayName = 'common.Extensions.NotificationBanner';

const NotificationBanner: FC<PropsWithChildren<NotificationBannerProps>> = ({
  status,
  title = '',
  children,
  action,
  isAlt = false,
}) => {
  const { formatMessage } = useIntl();
  const titleText = typeof title === 'string' ? title : formatMessage(title);

  const actionText = action && action.actionText;
  const actionMessage =
    typeof actionText === 'string'
      ? actionText
      : actionText && formatMessage(actionText);

  return (
    <div
      className={clsx(
        styles.banner,
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
            title={titleText}
            status={status}
            withIcon={!isAlt}
            textClassName={isAlt ? 'text-sm' : undefined}
          />
        </div>
        {children && (
          <div
            className={clsx('text-sm max-w-[50rem] mt-1.5', {
              'text-red-400': status === 'error',
            })}
          >
            {children}
          </div>
        )}
      </div>
      <div
        className={clsx(styles.actionWrapper, 'text-4', {
          'ml-0 md:ml-0 md:self-center': isAlt,
          'ml-6 md:ml-2': !isAlt,
        })}
      >
        {action && (
          <>
            {action.type === 'copy' && (
              <CopyUrl actionText={action.copyContent} />
            )}
            {action.type === 'redirect' && (
              <Link to={action.href}>{actionMessage}</Link>
            )}
            {action.type === 'call-to-action' && (
              <button type="button" onClick={action.onClick}>
                {actionMessage}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

NotificationBanner.displayName = displayName;

export default NotificationBanner;
