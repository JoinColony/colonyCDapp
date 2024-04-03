import { CheckCircle, WarningCircle, Info } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { StatusTypes } from './consts.ts';
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
  iconSize = 14,
}) => {
  const statusIcons = {
    [StatusTypes.Success]: CheckCircle,
    [StatusTypes.Warning]: WarningCircle,
    [StatusTypes.Error]: WarningCircle,
    [StatusTypes.Info]: Info,
  };

  const Icon = icon || statusIcons[status];

  return (
    <div
      className={clsx(className, 'flex', {
        'text-gray-500': status === StatusTypes.Info,
        'text-success-400': status === StatusTypes.Success,
        'text-warning-400': status === StatusTypes.Warning,
        'text-negative-400': status === StatusTypes.Error,
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
      {children && typeof children === 'string' && (
        <p className={textClassName}>{children}</p>
      )}
      {children && typeof children !== 'string' && (
        <div className={textClassName}>{children}</div>
      )}
    </div>
  );
};

StatusText.displayName = displayName;

export default StatusText;
