import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import styles from '../Input.module.css';
import { PillProps } from '../types';

const displayName = 'v5.common.Fields.partials.Pill';

const Pill: FC<PillProps> = ({ message, status }) => {
  const { formatMessage } = useIntl();

  const iconType =
    (status === 'success' && 'check-circle') ||
    (status === 'error' && 'x-circle') ||
    ((status === 'warning' && 'warning-circle') as string);

  return (
    <div
      className={clsx(styles.inputMessage, {
        'border-negative-200 text-negative-400': status === 'error',
        'border-success-200 text-success-400': status === 'success',
        'border-warning-400 text-warning-400': status === 'warning',
      })}
    >
      <Icon name={iconType} appearance={{ size: 'small' }} />
      <span className="ml-1">
        {formatMessage({
          id: message || 'too.many.characters',
        })}
      </span>
    </div>
  );
};

Pill.displayName = displayName;

export default Pill;
