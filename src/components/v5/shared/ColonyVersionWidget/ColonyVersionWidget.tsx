import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { useMobile } from '~hooks/index.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import Button from '~v5/shared/Button/index.ts';

import { type ColonyVersionWidgetProps } from './types.ts';

import styles from './ColonyVersionWidget.module.css';

const displayName = 'v5.ColonyVersionWidget';

const ColonyVersionWidget: FC<ColonyVersionWidgetProps> = ({
  status,
  latestVersion,
  currentVersion,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const handleUpgradeColony = () => {
    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.UpgradeColonyVersion,
    });
  };

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
              {status === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <WarningCircle size={18} />
              )}
            </span>
            <span>{currentVersion}</span>
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
              <CheckCircle size={18} />
            </span>
            <span>{latestVersion}</span>
          </div>
        </div>
      </div>
      <Button
        type="button"
        onClick={handleUpgradeColony}
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
