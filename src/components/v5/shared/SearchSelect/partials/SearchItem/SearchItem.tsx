import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { sortDisabled } from '../../utils';
import { SearchItemProps } from './types';
import Avatar from '~v5/shared/Avatar';
import { useMobile } from '~hooks';
import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';

const displayName = 'v5.SearchSelect.partials.SearchItem';

const SearchItem: FC<SearchItemProps> = ({
  options,
  onChange,
  isLabelVisible = true,
}) => {
  const { formatMessage } = useIntl();
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
        }) => {
          const firstDisabledOption = options.filter(
            (option) => option.isDisabled,
          )[0];
          const labelText =
            typeof label === 'string' ? label : formatMessage(label);

          const hasAvatar = showAvatar || !!color;

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
                  'w-full text-md transition-colors duration-normal text-left flex items-center',
                  {
                    'justify-between': !hasAvatar,
                    'justify-start': hasAvatar,
                    'text-gray-400 pointer-events-none gap-1': isDisabled,
                    'hover:text-blue-400': !missingPermissions,
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

                {color && isLabelVisible && (
                  <span className={clsx(color, 'mr-2 w-3.5 h-3.5 rounded')} />
                )}
                {showAvatar && (
                  <div className="mr-2">
                    <Avatar avatar={avatar} />
                  </div>
                )}
                {isLabelVisible && labelText}
                {firstDisabledOption?.value === value && (
                  <ExtensionsStatusBadge
                    mode="coming-soon"
                    text="Coming soon"
                  />
                )}
                {missingPermissions && (
                  <Tooltip
                    tooltipContent={
                      <span>{formatMessage({ id: missingPermissions })}</span>
                    }
                  >
                    <span className="text-warning-400">
                      <Icon
                        name="warning-circle"
                        appearance={{ size: 'tiny' }}
                      />
                    </span>
                  </Tooltip>
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
