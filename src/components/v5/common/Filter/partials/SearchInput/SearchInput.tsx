import React, { FC, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import debounce from 'lodash.debounce';

import Icon from '~shared/Icon';
import styles from './SearchInput.module.css';
import { useSearchContext } from '~context/SearchContext';
import { useMobile } from '~hooks';

import { SearchInputProps } from './types';

const SearchInput: FC<SearchInputProps> = ({ onSearchButtonClick }) => {
  const { formatMessage } = useIntl();
  const { setSearchValue } = useSearchContext();
  const [text, setText] = useState('');
  const isMobile = useMobile();

  const debounced = useMemo(
    () => debounce(setSearchValue, 500),
    [setSearchValue],
  );

  const onInput: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const { value } = e.target;

      if (!isMobile) {
        debounced(value);

        return;
      }
      setText(value);
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
      {isMobile && text && (
        <button
          type="button"
          className={styles.searchButton}
          aria-label={formatMessage({ id: 'ariaLabel.search' })}
          onClick={() => {
            setSearchValue(text);
            onSearchButtonClick();
          }}
        >
          <Icon name="magnifying-glass" appearance={{ size: 'small' }} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
