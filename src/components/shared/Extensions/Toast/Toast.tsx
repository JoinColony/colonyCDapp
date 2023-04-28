import React, { FC } from 'react';
import clsx from 'clsx';
import Link from '~shared/Link';
import { ToastComponentProps } from './types';
import Icon from '~shared/Icon';
import 'react-toastify/dist/ReactToastify.css';

const displayName = 'Extensions.ToastComponent';

const ToastComponent: FC<ToastComponentProps> = ({ type = 'success', title, description, linkName, url = '' }) => (
  <div className="flex bg-base-white w-[24.375rem] h-[5.75rem]">
    <div
      className={clsx({
        '[&>i>svg]:stroke-green-400': type === 'success',
        '[&>i>svg]:stroke-orange-400': type === 'alert',
        '[&>i>svg]:stroke-red-400': type === 'warning',
      })}
    >
      <Icon
        appearance={{ size: 'normal' }}
        name={(type === 'warning' && 'x-circle') || (type === 'alert' && 'warning-circle') || 'check-circle'}
      />
    </div>
    <div className="flex flex-col ml-[1.140625rem]">
      {title && <span className="text-md text-gray-900 font-semibold">{title}</span>}
      {description && <span className="text-md text-gray-600 font-normal">{description}</span>}
      {linkName && (
        <Link
          to={url}
          className={clsx('text-xs font-medium underline', {
            'text-green-400': type === 'success',
            'text-orange-400': type === 'alert',
            'text-red-400': type === 'warning',
          })}
        >
          {linkName}
        </Link>
      )}
    </div>
  </div>
);

ToastComponent.displayName = displayName;

export default ToastComponent;
