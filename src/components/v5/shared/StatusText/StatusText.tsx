import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import clsx from 'clsx';
import { StatusTextProps, STATUS_TYPES } from './types';
import Icon from '~shared/Icon';

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
        <Icon name={iconName[status]} appearance={{ size: 'tiny' }} />
      )}
      <p className={textClassName}>{titleText}</p>
    </div>
  );
};

export default StatusText;
