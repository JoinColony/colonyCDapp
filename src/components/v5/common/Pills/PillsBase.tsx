import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { PillsProps } from './types';
import styles from './PillsBase.module.css';
import Icon from '~shared/Icon';

const displayName = 'v5.common.Pills.PillsBase';

const PillsBase: FC<PropsWithChildren<PillsProps>> = ({
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
      className={clsx(className, styles.pills, {
        'text-3 h-[1.625rem]': pillSize === 'medium',
        'text-4 h-[1.5rem]': pillSize === 'small',
      })}
      {...rest}
    >
      {iconName && (
        <span className="flex shrink-0">
          <Icon
            name={iconName}
            appearance={{ size: pillSize === 'medium' ? 'tiny' : 'extraTiny' }}
          />
        </span>
      )}
      <span className={iconName ? 'ml-2' : ''}>{pillText || children}</span>
    </span>
  );
};

PillsBase.displayName = displayName;

export default PillsBase;
