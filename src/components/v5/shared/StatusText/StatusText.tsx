import React, { FC, PropsWithChildren } from 'react';

import clsx from 'clsx';
import { StatusType, StatusTextProps } from './types';
import Icon from '~shared/Icon';

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
    [StatusType.SUCCESS]: 'check-circle',
    [StatusType.WARNING]: 'warning-circle',
    [StatusType.ERROR]: 'warning-circle',
    [StatusType.INFO]: 'info',
  };

  return (
    <div
      className={clsx(className, 'flex', {
        'text-gray-900': status === StatusType.INFO,
        'text-success-400': status === StatusType.SUCCESS,
        'text-warning-400': status === StatusType.WARNING,
        'text-negative-400': status === StatusType.ERROR,
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
