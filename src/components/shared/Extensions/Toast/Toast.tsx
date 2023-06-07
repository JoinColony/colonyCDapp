import React, { FC } from 'react';
import clsx from 'clsx';

import { useIntl } from 'react-intl';
import Link from '~shared/Extensions/Link';
import { ToastProps } from './types';
import Icon from '~shared/Icon';

const displayName = 'Extensions.Toast';

const Toast: FC<ToastProps> = ({ type = 'success', title = '', description = '', linkName, url = '' }) => {
  const { formatMessage } = useIntl();
  const titleText = typeof title === 'string' ? title : formatMessage(title);
  const descriptionText = typeof description === 'string' ? description : formatMessage(description);

  return (
    <div className="flex bg-base-white relative">
      <div
        className={clsx({
          'text-success-400': type === 'success',
          'text-warning-400': type === 'warn',
          'text-negative-400': type === 'error',
        })}
      >
        <Icon
          appearance={{ size: 'normal' }}
          name={(type === 'error' && 'x-circle') || (type === 'warn' && 'warning-circle') || 'check-circle'}
        />
      </div>
      <div className="flex flex-col ml-[1.125rem] max-w-[90%]">
        {title && <span className="text-md text-gray-900 font-semibold">{titleText}</span>}
        {description && <span className="text-md text-gray-600 font-normal mt-1">{descriptionText}</span>}
        {linkName && (
          <div className="mt-1">
            <Link
              to={url}
              className={clsx('text-xs font-medium underline', {
                'text-success-400': type === 'success',
                'text-warning-400': type === 'warn',
                'text-negative-400': type === 'error',
              })}
            >
              {linkName}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

Toast.displayName = displayName;

export default Toast;
