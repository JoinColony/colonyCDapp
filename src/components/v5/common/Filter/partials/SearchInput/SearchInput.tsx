import React, { FC, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import debounce from 'lodash.debounce';

import Icon from '~shared/Icon';
import styles from './SearchInput.module.css';
import { useSearchContext } from '~context/SearchContext';
import { useMobile } from '~hooks';
import { SearchInputProps } from './types';

const displayName = 'v5.common.Filter.partials.SearchInput';

const SearchInput: FC<SearchInputProps> = ({ onSearchButtonClick }) => {
  const { formatMessage } = useIntl();
  const { setSearchValue } = useSearchContext();
  const [value, setValue] = useState('');
  const isMobile = useMobile();

  const debounced = useMemo(
    () => debounce(setSearchValue, 500),
    [setSearchValue],
  );

  const onInput: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target;

      if (!isMobile) {
        debounced(inputValue);

        return;
      }
      setValue(inputValue);
    },
    [debounced, isMobile],
  );

  return (
    <div className="w-full sm:px-4 sm:mb-6 relative">
      <div className="absolute top-3 left-3 sm:left-8 flex">
        <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
      </div>
      <input
        className={styles.searchInput}
        type="text"
        onInput={onInput}
        placeholder={formatMessage({ id: 'filter.input.placeholder' })}
      />
      {isMobile && value && (
        <button
          type="button"
          className={styles.searchButton}
          aria-label={formatMessage({ id: 'ariaLabel.search' })}
          onClick={() => {
            setSearchValue(value);
            onSearchButtonClick();
          }}
        >
          <Icon name="magnifying-glass" appearance={{ size: 'small' }} />
        </button>
      )}
    </div>
  );
};

SearchInput.displayName = displayName;

export default SearchInput;
