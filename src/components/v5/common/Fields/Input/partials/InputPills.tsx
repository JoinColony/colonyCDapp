import React, { FC } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { PillProps } from '../types';
import { formatText } from '~utils/intl';

const displayName = 'v5.common.Fields.Input.partials.InputPills';

const InputPills: FC<PillProps> = ({ message, status }) => {
  const iconType =
    (status === 'success' && 'check-circle') ||
    (status === 'error' && 'x-circle') ||
    ((status === 'warning' && 'warning-circle') as string);

  return (
    <div
      className={clsx(
        `flex self-start items-center text-sm font-normal absolute gap-1 pt-1`,
        {
          'text-negative-400': status === 'error',
          'text-success-400': status === 'success',
          'text-warning-400': status === 'warning',
        },
      )}
    >
      <Icon name={iconType} appearance={{ size: 'tiny' }} />
      <span>{formatText(message)}</span>
    </div>
  );
};

InputPills.displayName = displayName;

export default InputPills;
