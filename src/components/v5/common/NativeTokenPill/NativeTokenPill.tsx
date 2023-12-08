import React from 'react';
import { LockKey } from 'phosphor-react';

import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';

interface NativeTokenPillProps {
  tokenName: string;
  isLocked?: boolean;
}

const displayName = 'v5.shared.NativeTokenPill';

const NativeTokenPill = ({
  tokenName,
  isLocked = false,
}: NativeTokenPillProps) => {
  return (
    <div className="flex flex-row items-center p-[.375rem] border border-gray-200 rounded-lg bg-base-white text-gray-900">
      <span className="text-sm font-medium">{tokenName}</span>
      {isLocked && (
        <Tooltip
          tooltipContent={
            <span>{formatText({ id: 'tooltip.lockedToken' })}</span>
          }
        >
          <LockKey size={12} className="ml-[.125rem]" />
        </Tooltip>
      )}
    </div>
  );
};

NativeTokenPill.displayName = displayName;
export default NativeTokenPill;
