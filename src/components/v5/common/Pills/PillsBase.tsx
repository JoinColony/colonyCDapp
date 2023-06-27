import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { PillsProps } from './types';
import styles from './PillsBase.module.css';
import Icon from '~shared/Icon';

const displayName = 'v5.common.Pills.PillsBase';

const PillsBase: FC<PropsWithChildren<PillsProps>> = ({
  mode,
  className,
  children,
  text,
  textValues,
  iconName,
  pillSize = 'medium',
  ...rest
}) => {
  const { formatMessage } = useIntl();

  const pillText =
    typeof text == 'string' ? text : text && formatMessage(text, textValues);

  return (
    <span
      className={clsx(
        className,
        styles.pills,
        'inline-flex items-center text-center px-3 py-1 rounded-3xl capitalize',
        {
          'text-3 h-[1.625rem]': pillSize === 'medium',
          'text-4 h-[1.5rem]': pillSize === 'small',
          'bg-blue-100 text-blue-400': mode === 'dedicated',
          'bg-blue-400 text-base-white': mode === 'dedicated-filled',
          'bg-warning-100 text-warning-400': mode === 'active',
          'text-base-white bg-warning-400': mode === 'active-filled',
          'bg-success-100 text-success-400': mode === 'new',
          'text-base-white bg-success-400': mode === 'active-new',
          'bg-purple-100 text-purple-400': mode === 'top',
          'text-base-white bg-purple-400':
            mode === 'top-filled' || mode === 'team',
          'text-negative-400 bg-negative-100': mode === 'banned',
        },
      )}
      {...rest}
    >
      {iconName && (
        <span
          className={clsx('flex shrink-0', {
            'text-sm': pillSize === 'medium',
            'text-xs': pillSize === 'small',
          })}
        >
          <Icon
            name={iconName}
            appearance={{ size: pillSize === 'medium' ? 'tiny' : 'extraTiny' }}
          />
        </span>
      )}
      <span className={iconName ? 'ml-2' : 'ml-0'}>{pillText || children}</span>
    </span>
  );
};

PillsBase.displayName = displayName;

export default PillsBase;
