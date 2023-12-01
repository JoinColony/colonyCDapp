import React, { FC, PropsWithChildren } from 'react';

import clsx from 'clsx';
import { StatusTextProps } from './types';
import Icon from '~shared/Icon';
import { STATUS_TYPES } from './consts';

const displayName = 'v5.shared.StatusText';

const StatusText: FC<PropsWithChildren<StatusTextProps>> = ({
  children,
  status,
  className,
  iconName: iconNameProp,
  iconClassName,
  withIcon = true,
  textClassName = 'text-md',
  iconAlignment = 'center',
}) => {
  const iconName = {
    [STATUS_TYPES.SUCCESS]: 'check-circle',
    [STATUS_TYPES.WARNING]: 'warning-circle',
    [STATUS_TYPES.ERROR]: 'warning-circle',
    [STATUS_TYPES.INFO]: 'info',
  };

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
          name={iconNameProp || iconName[status]}
          className={clsx(
            iconClassName,
            'h-[.875rem] w-[.875rem] flex-shrink-0',
          )}
        />
      )}
      <p className={textClassName}>{children}</p>
    </div>
  );
};

StatusText.displayName = displayName;

export default StatusText;
