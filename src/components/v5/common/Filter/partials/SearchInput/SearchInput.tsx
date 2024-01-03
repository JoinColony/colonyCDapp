import clsx from 'clsx';
import debounce from 'lodash.debounce';
import React, {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import { useSearchContext } from '~context/SearchContext';
import { useMobile } from '~hooks';
import Icon from '~shared/Icon';

import { SearchInputProps } from './types';

import styles from './SearchInput.module.css';

const displayName = 'v5.common.Filter.partials.SearchInput';

const SearchInput: FC<SearchInputProps> = ({ onSearchButtonClick }) => {
  const { formatMessage } = useIntl();
  const { setSearchValue, searchValue } = useSearchContext();
  const [value, setValue] = useState('');
  const isMobile = useMobile();

  const debounced = useMemo(
    () => debounce(setSearchValue, 500),
    [setSearchValue],
  );

  const ref = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const onInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
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
    <div
      className={clsx(
        styles.wrapper,
        'group focus-within:border-blue-100 hover:after:border-blue-100 w-full relative',
      )}
    >
      <span className={styles.icon}>
        <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
      </span>
      <input
        ref={ref}
        className={clsx(
          styles.searchInput,
          'border-gray-300 focus:outline-none group-hover:border-blue-200 group-focus-within:border-blue-200',
        )}
        type="text"
        onInput={onInput}
        placeholder={formatMessage({ id: 'filter.input.placeholder' })}
        defaultValue={searchValue}
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
