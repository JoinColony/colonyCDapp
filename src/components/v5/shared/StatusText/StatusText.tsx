import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import clsx from 'clsx';
import { StatusTextProps } from './types';
import Icon from '~shared/Icon';
import { STATUS_TYPES } from './consts';

const displayName = 'v5.shared.StatusText';

const StatusText: FC<StatusTextProps> = ({
  title,
  status,
  withIcon = true,
  textClassName = 'text-md',
}) => {
  const { formatMessage } = useIntl();

  const titleText = typeof title === 'string' ? title : formatMessage(title);
  const iconName = {
    [STATUS_TYPES.SUCCESS]: 'check-circle',
    [STATUS_TYPES.WARNING]: 'warning-circle',
    [STATUS_TYPES.ERROR]: 'warning-circle',
  };

  return (
    <div
      className={clsx('flex items-center', {
        'text-success-400': status === STATUS_TYPES.SUCCESS,
        'text-warning-400': status === STATUS_TYPES.WARNING,
        'text-negative-400': status === STATUS_TYPES.ERROR,
        'gap-1': withIcon,
      })}
    >
      {withIcon && (
        <Icon
          name={iconName[status]}
          className="h-[.875rem] w-[.875rem] flex-shrink-0"
        />
      )}
      <p className={textClassName}>{titleText}</p>
    </div>
  );
};

StatusText.displayName = displayName;

export default StatusText;
