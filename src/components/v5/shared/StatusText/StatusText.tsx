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
    [StatusTypes.SUCCESS]: CheckCircle,
    [StatusTypes.WARNING]: WarningCircle,
    [StatusTypes.ERROR]: WarningCircle,
    [StatusTypes.INFO]: Info,
  };

  const Icon = icon || statusIcons[status];

  return (
    <div
      className={clsx(className, 'flex', {
        'text-gray-900': status === StatusTypes.INFO,
        'text-success-400': status === StatusTypes.SUCCESS,
        'text-warning-400': status === StatusTypes.WARNING,
        'text-negative-400': status === StatusTypes.ERROR,
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
