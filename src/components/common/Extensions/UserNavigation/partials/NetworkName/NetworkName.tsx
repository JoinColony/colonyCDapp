import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useMobile } from '~hooks/index.ts';
import GanacheIcon from '~icons/GanacheIcon.tsx';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';

import { type NetworkNameProps } from './types.ts';

const displayName = 'common.Extensions.UserNavigation.partials.NetworkName';

const NetworkName: FC<NetworkNameProps> = ({
  networkInfo,
  size = 14,
  error = false,
  errorMessage,
}) => {
  const Icon = networkInfo.icon || GanacheIcon;
  const isMobile = useMobile();

  return (
    <Tooltip
      tooltipContent={errorMessage}
      placement={isMobile ? 'bottom' : 'left'}
      trigger={error ? 'hover' : null}
    >
      <div
        className={clsx(
          'flex min-h-[2.375rem] min-w-[2.875rem] items-center justify-center gap-1 rounded-full border border-gray-200 bg-base-white px-3 py-0 sm:min-w-[2.75rem]',
          {
            'border-warning-400': error,
            'cursor-pointer': error,
            'text-warning-400': error,
          },
        )}
      >
        <Icon size={size} />
        <p className="hidden text-gray-700 text-3 md:block">
          {networkInfo.name}
        </p>
        {error && <WarningCircle size={16} />}
      </div>
    </Tooltip>
  );
};

NetworkName.displayName = displayName;

export default NetworkName;
