import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import clsx from 'clsx';
import { IconedTextProps, STATUS_TYPES } from './types';
import Icon from '~shared/Icon';

const IconedText: FC<IconedTextProps> = ({
  title,
  status,
  withIcon = true,
  fontSizeClassName = 'text-md',
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
      <p className={fontSizeClassName}>{titleText}</p>
    </div>
  );
};

export default IconedText;
