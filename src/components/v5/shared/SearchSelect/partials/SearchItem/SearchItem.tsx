import { CircleWavyCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { DomainColor } from '~gql';
import { useMobile } from '~hooks/index.ts';
import MaskedAddress from '~shared/MaskedAddress/MaskedAddress.tsx';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamColor } from '~utils/teams.ts';
import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge/index.ts';
import { sortDisabled } from '~v5/shared/SearchSelect/utils.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';
import { UserAvatar } from '~v5/shared/UserAvatar/UserAvatar.tsx';

import { SearchItemLabelText } from '../SearchItemLabelText/index.tsx';

import { type SearchItemProps } from './types.ts';

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
        '-mx-2 flex flex-wrap items-center gap-y-6 sm:w-[8.75rem]':
          !isLabelVisible,
        'sm:w-[12.75rem]': !isLabelVisible && isMobile,
      })}
    >
      {sortDisabled(options).map(
        ({
          label,
          value,
          isDisabled,
          isComingSoon,
          isNew,
          icon: Icon,
          avatar,
          showAvatar,
          color,
          walletAddress = '',
          token,
          isVerified,
        }) => {
          const labelText = formatText(label || '');

          const hasAvatar = showAvatar || !!color || !!token;
          const teamColor = getTeamColor(
            color ? getEnumValueFromKey(DomainColor, color) : undefined,
          );

          return (
            <li
              className={clsx('overflow-x-auto', {
                'mb-1 w-full': isLabelVisible,
                'inline-flex w-1/4': !isLabelVisible,
              })}
              key={value}
            >
              <button
                type="button"
                className={clsx(
                  'flex w-full items-center rounded px-2 text-left text-md transition-colors hover:bg-gray-50 hover:font-medium',
                  {
                    'justify-between': !hasAvatar,
                    'justify-start': hasAvatar,
                    'pointer-events-none gap-1 text-gray-400': isDisabled,
                    'justify-center': !isLabelVisible,
                    'py-1.5': isLabelVisible,
                  },
                )}
                name={value.toString()}
                onClick={() => {
                  onChange?.(value);
                }}
              >
                <div className="relative flex w-full items-center">
                  {Icon && <Icon size={20} className="mr-2" />}
                  {color && !isLabelVisible && (
                    <div
                      className={clsx(teamColor, 'mx-auto rounded sm:mx-0', {
                        'h-[1.125rem] w-[1.125rem]': !isMobile,
                        'aspect-square h-auto w-7': isMobile,
                      })}
                    />
                  )}
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
                  {color && isLabelVisible && (
                    <span
                      className={clsx(teamColor, 'mr-2 h-3.5 w-3.5 rounded')}
                    />
                  )}
                  {showAvatar && (
                    <UserAvatar
                      className="mr-2"
                      userAvatarSrc={
                        avatar && avatar.length > 0 ? avatar : undefined
                      }
                      userAddress={walletAddress}
                      size={20}
                    />
                  )}
                  <span className="truncate">
                    {isLabelVisible && (
                      <SearchItemLabelText labelText={labelText} />
                    )}
                    {!label && <MaskedAddress address={walletAddress} />}
                  </span>
                  {isVerified && (
                    <CircleWavyCheck
                      size={14}
                      className="ml-1 flex-shrink-0 text-blue-400"
                    />
                  )}
                  {isComingSoon && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
                      <ExtensionsStatusBadge
                        mode="coming-soon"
                        text={formatText({ id: 'status.comingSoon' })}
                      />
                    </div>
                  )}
                  {isNew && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
                      <ExtensionsStatusBadge
                        mode="new"
                        text={formatText({ id: 'status.new' })}
                      />
                    </div>
                  )}
                </div>
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
