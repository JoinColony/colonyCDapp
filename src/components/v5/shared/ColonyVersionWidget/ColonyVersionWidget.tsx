import clsx from 'clsx';
import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks';
import Icon from '~shared/Icon';
import Button from '~v5/shared/Button';

import { ColonyVersionWidgetProps } from './types';

import styles from './ColonyVersionWidget.module.css';

const displayName = 'v5.ColonyVersionWidget';

const ColonyVersionWidget: FC<ColonyVersionWidgetProps> = ({
  status,
  latestVersion,
  currentVersion,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  return (
    <div
      className={clsx(
        'flex rounded border border-gray-200 bg-base-white px-5 py-[1.125rem]',
        {
          'flex-col': isMobile,
        },
      )}
    >
      <div
        className={clsx('flex items-center gap-6 w-full', {
          'flex-col mb-6': isMobile,
          'mr-6': !isMobile,
        })}
      >
        <div className={styles.wrapper}>
          {formatMessage({ id: 'current.version' })}
          <div className={styles.text}>
            <span
              className={clsx({
                'text-success-400': status === 'success',
                'text-warning-400': status === 'error',
              })}
            >
              <Icon
                appearance={{ size: 'extraTiny' }}
                name={status === 'success' ? 'check-circle' : 'warning-circle'}
              />
            </span>
            <span className={styles.value}>{currentVersion}</span>
          </div>
        </div>

        <div
          className={clsx('bg-gray-200', {
            'w-full h-px': isMobile,
            'h-full w-px': !isMobile,
          })}
        />

        <div className={styles.wrapper}>
          {formatMessage({ id: 'latest.version' })}
          <div className={styles.text}>
            <span className="text-success-400">
              <Icon appearance={{ size: 'extraTiny' }} name="check-circle" />
            </span>
            <span className={styles.value}>{latestVersion}</span>
          </div>
        </div>
      </div>
      <Button
        type="button"
        disabled={status === 'success'}
        mode="primarySolid"
        isFullSize={isMobile}
        className="min-w-[7.625rem]"
      >
        {formatMessage({ id: 'button.upgrade.colony' })}
      </Button>
    </div>
  );
};

ColonyVersionWidget.displayName = displayName;

export default ColonyVersionWidget;
