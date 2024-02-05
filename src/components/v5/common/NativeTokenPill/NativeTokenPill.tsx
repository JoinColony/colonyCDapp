import { LockKey } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import TokenInfoPopover from '~shared/TokenInfoPopover/index.ts';
import { type Token } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

interface NativeTokenPillProps {
  variant?: 'primary' | 'secondary';
  token: Token;
  isLocked?: boolean;
}

const displayName = 'v5.shared.NativeTokenPill';

const NativeTokenPill = ({
  variant = 'primary',
  token,
  isLocked = false,
}: NativeTokenPillProps) => {
  return (
    <div
      className={clsx(
        'h-[1.875rem] flex flex-row items-center px-1.5 rounded-lg text-gray-900 cursor-pointer',
        {
          'bg-base-bg': variant === 'primary',
          'border border-gray-200 bg-base-white': variant === 'secondary',
        },
      )}
    >
      <TokenInfoPopover token={token} isTokenNative>
        <span className="text-sm font-medium">{token.symbol}</span>
      </TokenInfoPopover>
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
