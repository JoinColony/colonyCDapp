import React from 'react';
import { LockKey } from '@phosphor-icons/react';
import clsx from 'clsx';

import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';

interface NativeTokenPillProps {
  variant?: 'primary' | 'secondary';
  tokenName: string;
  isLocked?: boolean;
}

const displayName = 'v5.shared.NativeTokenPill';

const NativeTokenPill = ({
  variant = 'primary',
  tokenName,
  isLocked = false,
}: NativeTokenPillProps) => {
  return (
    <div
      className={clsx(
        'h-[1.875rem] flex flex-row items-center px-1.5 rounded-lg text-gray-900',
        {
          'bg-base-bg': variant === 'primary',
          'border border-gray-200 bg-base-white': variant === 'secondary',
        },
      )}
    >
      <span className="text-sm font-medium">{tokenName}</span>
      {isLocked && (
        <Tooltip
          tooltipContent={
            <span>{formatText({ id: 'tooltip.lockedToken' })}</span>
          }
        >
          <LockKey size={11} className="ml-0.5" />
        </Tooltip>
      )}
    </div>
  );
};

NativeTokenPill.displayName = displayName;
export default NativeTokenPill;
