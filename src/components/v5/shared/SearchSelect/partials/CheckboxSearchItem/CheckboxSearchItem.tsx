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
                'w-full mb-1': isLabelVisible,
                'inline-flex w-1/4': !isLabelVisible,
              })}
              key={value}
            >
              <label
                className={clsx(
                  'w-full text-md transition-colors text-left flex items-center py-1.5 rounded px-2',
                  {
                    'justify-between': !hasAvatar,
                    'justify-start': hasAvatar,
                    'text-gray-400 pointer-events-none gap-1': isDisabled,

                    'justify-center': !isLabelVisible,
                    'cursor-pointer': !!checkboxesList,
                  },
                )}
                htmlFor={value.toString()}
              >
                <div className="relative w-full flex items-center">
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
                      className={clsx(teamColor, 'rounded shrink-0', {
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
                    <span
                      className={clsx(teamColor, 'mr-2 w-3.5 h-3.5 rounded')}
                    />
                  )}
                  {showAvatar && (
                    <div className="mr-2 items-center justify-center flex">
                      <UserAvatar
                        avatar={avatar}
                        user={walletAddress}
                        size="xs"
                      />
                    </div>
                  )}
                  {isLabelVisible && labelText}
                  {isVerified && (
                    <span className="flex ml-1 text-blue-400">
                      <SealCheck size={14} />
                    </span>
                  )}
                  {!label && <span className="truncate">{walletAddress}</span>}
                  {firstDisabledOption?.value === value && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
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
