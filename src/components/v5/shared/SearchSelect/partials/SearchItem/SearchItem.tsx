import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { sortDisabled } from '../../utils';
import styles from '../../SearchSelect.module.css';
import { SearchItemProps } from './types';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { Actions } from '~constants/actions';

const displayName = 'v5.SearchSelect.partials.SearchItem';

const SearchItem: FC<SearchItemProps> = ({ options }) => {
  const { formatMessage } = useIntl();
  const { setSelectedAction } = useActionSidebarContext();

  return (
    <ul className="w-full">
      {sortDisabled(options).map(({ label, value, isDisabled }) => {
        const firstDisabledOption = options.filter(
          (option) => option.isDisabled,
        )[0];

        return (
          <li className="mb-4 last:mb-0 w-full" key={value}>
            <button
              type="button"
              className={clsx(styles.button, {
                'text-gray-400 pointer-events-none': isDisabled,
              })}
              onClick={() => setSelectedAction(value as Actions)}
            >
              {formatMessage(label)}
              {firstDisabledOption?.value === value && (
                <ExtensionsStatusBadge mode="coming-soon" text="Coming soon" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

SearchItem.displayName = displayName;

export default SearchItem;
