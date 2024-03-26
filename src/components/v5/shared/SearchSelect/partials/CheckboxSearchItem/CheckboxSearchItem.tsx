import { SealCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { DomainColor } from '~gql';
import { useMobile } from '~hooks/index.ts';
import TokenIcon from '~shared/TokenIcon/index.ts';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamColor } from '~utils/teams.ts';
import Checkbox from '~v5/common/Checkbox/Checkbox.tsx';
import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import { sortDisabled } from '../../utils.ts';

import { type CheckboxSearchItemProps } from './types.ts';

const displayName = 'v5.SearchSelect.partials.CheckboxSearchItem';

const CheckboxSearchItem: FC<CheckboxSearchItemProps> = ({
  options,
  onChange,
  checkboxesList,
  isLabelVisible = true,
}) => {
  const isMobile = useMobile();

  return (
    <ul
      className={clsx({
        'w-full': isLabelVisible,
        '-mx-2 flex flex-wrap items-center gap-y-4 sm:w-[8.75rem]':
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
          walletAddress = '',
          token,
          isVerified,
        }) => {
          const firstDisabledOption = options.filter(
            (option) => option.isDisabled,
          )[0];
          const labelText = formatText(label || '');

          const hasAvatar = showAvatar || !!color || !!token;
          const teamColor = getTeamColor(
            color ? getEnumValueFromKey(DomainColor, color) : undefined,
          );

          return (
            <li
              className={clsx({
                'mb-1 w-full': isLabelVisible,
                'inline-flex w-1/4': !isLabelVisible,
              })}
              key={value}
            >
              <label
                className={clsx(
                  'flex w-full items-center rounded px-2 py-1.5 text-left text-md transition-colors',
                  {
                    'justify-between': !hasAvatar,
                    'justify-start': hasAvatar,
                    'pointer-events-none gap-1 text-gray-400': isDisabled,

                    'justify-center': !isLabelVisible,
                    'cursor-pointer': !!checkboxesList,
                  },
                )}
                htmlFor={value.toString()}
              >
                <div className="relative flex w-full items-center">
                  {checkboxesList && (
                    <Checkbox
                      name={value.toString()}
                      id={value.toString()}
                      isChecked={checkboxesList.includes(value.toString())}
                      onChange={() => {
                        onChange?.(value);
                      }}
                    />
                  )}
                  {color && !isLabelVisible && (
                    <div
                      className={clsx(teamColor, 'shrink-0 rounded', {
                        'h-[1.125rem] w-[1.125rem]': !isMobile,
                        'h-7 w-7': isMobile,
                      })}
                    />
                  )}
                  {token && (
                    <div className="mr-2">
                      <TokenIcon token={token} size="xxs" />
                    </div>
                  )}
                  {color && isLabelVisible && (
                    <span
                      className={clsx(teamColor, 'mr-2 h-3.5 w-3.5 rounded')}
                    />
                  )}
                  {showAvatar && (
                    <div className="mr-2 flex items-center justify-center">
                      <UserAvatar
                        avatar={avatar}
                        user={walletAddress}
                        size="xs"
                      />
                    </div>
                  )}
                  {isLabelVisible && labelText}
                  {isVerified && (
                    <span className="ml-1 flex text-blue-400">
                      <SealCheck size={14} />
                    </span>
                  )}
                  {!label && <span className="truncate">{walletAddress}</span>}
                  {firstDisabledOption?.value === value && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
                      <ExtensionsStatusBadge
                        mode="coming-soon"
                        text="Coming soon"
                      />
                    </div>
                  )}
                </div>
              </label>
            </li>
          );
        },
      )}
    </ul>
  );
};

CheckboxSearchItem.displayName = displayName;

export default CheckboxSearchItem;
