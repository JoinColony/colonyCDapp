import React, { FC } from 'react';
import clsx from 'clsx';
import Link from '~shared/Link';
import { ToastProps } from './types';
import Icon from '~shared/Icon';

const displayName = 'Extensions.Toast';

const Toast: FC<ToastProps> = ({ type = 'success', title, description, linkName, url = '' }) => (
  <div className="flex bg-base-white relative">
    <div
      className={clsx({
        '[&>i>svg]:fill-success-400': type === 'success',
        '[&>i>svg]:fill-warning-400': type === 'alert',
        '[&>i>svg]:fill-negative-400': type === 'warning',
      })}
    >
      <Icon
        appearance={{ size: 'normal' }}
        name={(type === 'warning' && 'x-circle') || (type === 'alert' && 'warning-circle') || 'check-circle'}
      />
    </div>
    <div className="flex flex-col ml-[1.140625rem]">
      {title && <span className="text-md text-gray-900 font-semibold pb-1">{title}</span>}
      {description && <span className="text-md text-gray-600 font-normal pb-1">{description}</span>}
      {linkName && (
        <Link
          to={url}
          className={clsx('text-xs font-medium underline', {
            'text-success-400': type === 'success',
            'text-warning-400': type === 'alert',
            'text-negative-400': type === 'warning',
          })}
        >
          {linkName}
        </Link>
      )}
    </div>
  </div>
);

Toast.displayName = displayName;

export default Toast;
