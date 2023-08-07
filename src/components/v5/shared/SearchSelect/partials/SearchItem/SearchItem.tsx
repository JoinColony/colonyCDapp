import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { sortDisabled } from '../../utils';
import styles from '../../SearchSelect.module.css';
import { SearchItemProps } from './types';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { Actions } from '~constants/actions';
import Avatar from '~v5/shared/Avatar';

const displayName = 'v5.SearchSelect.partials.SearchItem';

const SearchItem: FC<SearchItemProps> = ({ options, onChange }) => {
  const { formatMessage } = useIntl();
  const { setSelectedAction } = useActionSidebarContext();

  return (
    <ul className="w-full">
      {sortDisabled(options).map(
        ({ label, value, isDisabled, avatar, showAvatar, color }) => {
          const firstDisabledOption = options.filter(
            (option) => option.isDisabled,
          )[0];
          const labelText =
            typeof label === 'string' ? label : formatMessage(label);

          const hasAvatar = showAvatar || !!color;

          return (
            <li className="mb-4 last:mb-0 w-full" key={value}>
              <button
                type="button"
                className={clsx(styles.button, {
                  'justify-between': !hasAvatar,
                  'justify-start': hasAvatar,
                  'text-gray-400 pointer-events-none': isDisabled,
                })}
                onClick={() => {
                  if (Object.values(Actions).includes(value as Actions)) {
                    setSelectedAction(value as Actions);
                  }
                  onChange?.(value);
                }}
              >
                {color && (
                  <span className={clsx(color, 'mr-2 w-3.5 h-3.5 rounded')} />
                )}
                {showAvatar && (
                  <div className="mr-2">
                    <Avatar avatar={avatar} />
                  </div>
                )}
                {labelText}
                {firstDisabledOption?.value === value && (
                  <ExtensionsStatusBadge
                    mode="coming-soon"
                    text="Coming soon"
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
