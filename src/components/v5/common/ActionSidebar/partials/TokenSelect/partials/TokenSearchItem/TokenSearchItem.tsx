import clsx from 'clsx';
import React, { type FC } from 'react';

import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { type TokenSearchItemProps } from './types.ts';
import { sortDisabled } from './utils.ts';

const displayName =
  'v5.common.ActionsContent.partials.TokenSelect.partials.TokenSearchItem';

const TokenSearchItem: FC<TokenSearchItemProps> = ({
  options,
  onOptionClick,
}) => (
  <ul className="w-full">
    {sortDisabled(options).map(({ label, value, isDisabled, token }) => (
      <li className="mb-1 w-full overflow-x-auto" key={value}>
        <button
          type="button"
          className={clsx(
            'flex w-full items-center justify-start rounded px-2 py-1.5 text-left text-md transition-colors',
            {
              'pointer-events-none text-gray-400': isDisabled,
            },
          )}
          name={value.toString()}
          disabled={isDisabled}
          onClick={() => {
            onOptionClick?.(value);
          }}
        >
          <div className="relative flex w-full items-center">
            {token && (
              <div className="mr-2">
                <TokenAvatar
                  size={18}
                  tokenName={token.name}
                  tokenAddress={token.tokenAddress}
                  tokenAvatarSrc={token.avatar ?? undefined}
                />
              </div>
            )}
            {label}
          </div>
        </button>
      </li>
    ))}
  </ul>
);

TokenSearchItem.displayName = displayName;

export default TokenSearchItem;
