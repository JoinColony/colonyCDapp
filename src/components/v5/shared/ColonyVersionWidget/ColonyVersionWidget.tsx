import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { CoreAction } from '~actions/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks/index.ts';
import { tw } from '~utils/css/index.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import Button from '~v5/shared/Button/index.ts';

import { type ColonyVersionWidgetProps } from './types.ts';

const displayName = 'v5.ColonyVersionWidget';

const ColonyVersionWidget: FC<ColonyVersionWidgetProps> = ({
  status,
  latestVersion,
  currentVersion,
}) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const { show } = useActionSidebarContext();

  const handleUpgradeColony = () => {
    show({
      [ACTION_TYPE_FIELD_NAME]: CoreAction.VersionUpgrade,
    });
  };

  const textClass = tw`flex items-center justify-center gap-1`;
  const valueClass = tw`heading-5`;
  const wrapperClass = tw`flex min-w-[20rem] flex-col justify-center text-center text-gray-500 text-1`;

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
        className={clsx('flex w-full items-center gap-6', {
          'mb-6 flex-col': isMobile,
          'mr-6': !isMobile,
        })}
      >
        <div className={wrapperClass}>
          {formatMessage({ id: 'current.version' })}
          <div className={textClass}>
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
            <span className={valueClass}>{currentVersion}</span>
          </div>
        </div>

        <div
          className={clsx('bg-gray-200', {
            'h-px w-full': isMobile,
            'h-full w-px': !isMobile,
          })}
        />

        <div className={wrapperClass}>
          {formatMessage({ id: 'latest.version' })}
          <div className={textClass}>
            <span className="text-success-400">
              <CheckCircle size={18} />
            </span>
            <span className={valueClass}>{latestVersion}</span>
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
