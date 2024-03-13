import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import StatusCircle from '~shared/StatusCircle/StatusCircle.tsx';
import Link from '~v5/shared/Link/index.ts';

import { type ToastProps } from './types.ts';

import './Toast.css';

const displayName = 'Extensions.Toast';

const Toast: FC<ToastProps> = ({
  type = 'success',
  title,
  description,
  linkName,
  url,
}) => {
  const { formatMessage } = useIntl();
  const titleText =
    typeof title === 'string' ? title : title && formatMessage(title);
  const descriptionText =
    typeof description === 'string'
      ? description
      : description && formatMessage(description);

  return (
    <div className="relative flex bg-base-white font-inter">
      <div
        className={clsx({
          'text-success-400': type === 'success',
          'text-warning-400': type === 'warn',
          'text-negative-400': type === 'error',
        })}
      >
        <StatusCircle size={20} status={type} />
      </div>
      <div className="ml-[1.125rem] flex max-w-[90%] flex-col">
        {title && <span className="text-gray-900 text-2">{titleText}</span>}
        {description && (
          <span className="mt-1 text-md text-gray-600">{descriptionText}</span>
        )}
        {linkName && url && (
          <div className="mt-1">
            <Link
              to={url}
              className={clsx('underline text-4', {
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
