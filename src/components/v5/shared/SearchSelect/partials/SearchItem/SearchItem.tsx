import React, { FC } from 'react';
import clsx from 'clsx';

import { useMobile } from '~hooks';
import TokenIcon from '~shared/TokenIcon';
import { formatText } from '~utils/intl';
import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import Avatar from '~v5/shared/Avatar';
import IconWithTooltip from '~v5/shared/IconWithTooltip';

import { sortDisabled } from '../../utils';
import { SearchItemProps } from './types';

const displayName = 'v5.SearchSelect.partials.SearchItem';

const SearchItem: FC<SearchItemProps> = ({
  options,
  onChange,
  isLabelVisible = true,
}) => {
  const isMobile = useMobile();

  return (
    <ul
      className={clsx({
        'w-full': isLabelVisible,
        'flex -mx-2 items-center flex-wrap sm:w-[8.75rem] gap-y-4':
          !isLabelVisible,
        'sm:w-[12.75rem]': !isLabelVisible && isMobile,
      })}
    >
      {sortDisabled(options).map(
        ({
          label,
          value,
          isDisabled,
          avatar,
          showAvatar,
          color,
          missingPermissions,
          walletAddress = '',
          token,
        }) => {
          const firstDisabledOption = options.filter(
            (option) => option.isDisabled,
          )[0];
          const labelText = formatText(label || '');

          const hasAvatar = showAvatar || !!color || !!token;

          return (
            <li
              className={clsx({
                'w-full mb-1': isLabelVisible,
                'inline-flex w-1/4': !isLabelVisible,
              })}
              key={value}
            >
              <button
                type="button"
                className={clsx(
                  'w-full text-md relative transition-colors text-left flex items-center py-1.5 rounded px-2',
                  {
                    'justify-between': !hasAvatar,
                    'justify-start': hasAvatar,
                    'text-gray-400 pointer-events-none gap-1': isDisabled,
                    'md:hover:bg-gray-50 md:hover:font-medium':
                      !missingPermissions,
                    'justify-center': !isLabelVisible,
                  },
                )}
                onClick={() => {
                  if (missingPermissions) return;

                  onChange?.(value);
                }}
              >
                {color && !isLabelVisible && (
                  <div
                    className={clsx(color, 'rounded shrink-0', {
                      'w-[1.125rem] h-[1.125rem]': !isMobile,
                      'w-7 h-7': isMobile,
                    })}
                  />
                )}
                {token && (
                  <div className="mr-2">
                    <TokenIcon token={token} size="xxs" />
                  </div>
                )}
                {color && isLabelVisible && (
                  <span className={clsx(color, 'mr-2 w-3.5 h-3.5 rounded')} />
                )}
                {showAvatar && (
                  <div className="mr-2 items-center justify-center flex">
                    <Avatar avatar={avatar} seed={walletAddress} />
                  </div>
                )}
                {isLabelVisible && labelText}
                {!label && <span className="truncate">{walletAddress}</span>}
                {firstDisabledOption?.value === value && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <ExtensionsStatusBadge
                      mode="coming-soon"
                      text="Coming soon"
                    />
                  </div>
                )}
                {missingPermissions && (
                  <IconWithTooltip
                    tooltipContent={formatText({ id: missingPermissions })}
                    className="text-warning-400 h-4 w-4 justify-center items-center"
                    iconProps={{
                      name: 'warning-circle',
                      appearance: { size: 'tiny' },
                    }}
                  />
                )}
              </button>
            </li>
          );
        },
      )}
    </ul>
  );
};

SearchItem.displayName = displayName;

export default SearchItem;
