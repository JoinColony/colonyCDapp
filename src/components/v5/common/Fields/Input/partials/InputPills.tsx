import clsx from 'clsx';
import React, { FC } from 'react';

import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';

import { PillProps } from '../types';

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
      {message && <span className="ml-1">{formatText(message)}</span>}
    </div>
  );
};

InputPills.displayName = displayName;

export default InputPills;
