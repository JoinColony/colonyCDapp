import React, { FC } from 'react';
import clsx from 'clsx';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { sortDisabled } from '../../utils';
import { SearchItemProps } from './types';
import Avatar from '~v5/shared/Avatar';
import { useMobile } from '~hooks';
import IconWithTooltip from '~v5/shared/IconWithTooltip';
import TokenIcon from '~shared/TokenIcon';
import { formatText } from '~utils/intl';

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
        'flex -mx-2 items-center flex-wrap w-[8.75rem] gap-y-4':
          !isLabelVisible,
        'w-[12.75rem]': !isLabelVisible && isMobile,
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
                'w-full mb-4': isLabelVisible,
                'inline-flex w-1/4 px-2': !isLabelVisible,
              })}
              key={value}
            >
              <button
                type="button"
                className={clsx(
                  'w-full text-md transition-colors text-left flex items-center',
                  {
                    'justify-between': !hasAvatar,
                    'justify-start': hasAvatar,
                    'text-gray-400 pointer-events-none gap-1': isDisabled,
                    'md:hover:text-blue-400': !missingPermissions,
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
                  <div className="mr-2">
                    <Avatar avatar={avatar} />
                  </div>
                )}
                {isLabelVisible && labelText}
                {!label && <span className="truncate">{walletAddress}</span>}
                {firstDisabledOption?.value === value && (
                  <ExtensionsStatusBadge
                    mode="coming-soon"
                    text="Coming soon"
                  />
                )}
                {missingPermissions && (
                  <IconWithTooltip
                    tooltipContent={formatText({ id: missingPermissions })}
                    iconName="warning-circle"
                    className="text-warning-400"
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
