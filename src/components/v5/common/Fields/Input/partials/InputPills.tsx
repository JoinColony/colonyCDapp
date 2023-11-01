import React, { FC } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import styles from '../Input.module.css';
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
      className={clsx(`${styles.inputMessage} absolute top-[3.2rem]`, {
        'border-negative-200 text-negative-400': status === 'error',
        'border-success-200 text-success-400': status === 'success',
        'border-warning-400 text-warning-400': status === 'warning',
      })}
    >
      <Icon name={iconType} appearance={{ size: 'small' }} />
      <span className="ml-1">{formatText(message)}</span>
    </div>
  );
};

InputPills.displayName = displayName;

export default InputPills;
