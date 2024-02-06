import { CheckCircle, WarningCircle, Info } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { STATUS_TYPES } from './consts.ts';
import { type StatusTextProps } from './types.ts';

const displayName = 'v5.shared.StatusText';

const StatusText: FC<PropsWithChildren<StatusTextProps>> = ({
  children,
  status,
  className,
  icon,
  iconClassName,
  withIcon = true,
  textClassName = 'text-md',
  iconAlignment = 'center',
  iconSize = 'tiny',
}) => {
  const iconName = {
    [STATUS_TYPES.SUCCESS]: CheckCircle,
    [STATUS_TYPES.WARNING]: WarningCircle,
    [STATUS_TYPES.ERROR]: WarningCircle,
    [STATUS_TYPES.INFO]: Info,
  };

  const Icon = icon || iconName[status];

  return (
    <div
      className={clsx(className, 'flex', {
        'text-gray-900': status === STATUS_TYPES.INFO,
        'text-success-400': status === STATUS_TYPES.SUCCESS,
        'text-warning-400': status === STATUS_TYPES.WARNING,
        'text-negative-400': status === STATUS_TYPES.ERROR,
        'gap-2': withIcon,
        'items-center': iconAlignment === 'center',
        'items-start': iconAlignment === 'top',
      })}
    >
      {withIcon && (
        <Icon
          size={iconSize}
          className={clsx(iconClassName, 'flex-shrink-0')}
        />
      )}
      <p className={textClassName}>{children}</p>
    </div>
  );
};

StatusText.displayName = displayName;

export default StatusText;
