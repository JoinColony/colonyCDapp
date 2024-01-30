import { MagnifyingGlass, X } from '@phosphor-icons/react';
import clsx from 'clsx';
import debounce from 'lodash.debounce';
import React, {
  type ChangeEvent,
  type ChangeEventHandler,
  type FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import { useMobile } from '~hooks/index.ts';

import { type SearchInputProps } from './types.ts';

import styles from './SearchInput.module.css';

const displayName = 'v5.common.Filter.partials.SearchInput';

const SearchInput: FC<SearchInputProps> = ({
  onSearchButtonClick,
  setSearchValue,
  searchValue,
  searchInputPlaceholder,
}) => {
  const { formatMessage } = useIntl();
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
      setValue(inputValue);

      if (!isMobile) {
        debounced(inputValue);
      }
    },
    [debounced, isMobile],
  );

  const showClearButton = ref.current?.value ?? searchValue !== '';

  const handleClearSearchInput = () => {
    if (ref.current) {
      ref.current.focus();
      ref.current.value = '';
    }

    setValue('');
    setSearchValue('');
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>
        <MagnifyingGlass size={14} />
      </span>
      <input
        ref={ref}
        className={clsx(
          styles.searchInput,
          'border-gray-300 focus:outline-none group-hover:border-blue-200 group-focus-within:border-blue-200',
          isMobile && value && '!pr-[5.375rem]',
        )}
        type="text"
        onInput={onInput}
        placeholder={searchInputPlaceholder}
        defaultValue={searchValue}
      />
      {showClearButton && (
        <button
          className={clsx(
            styles.clearSearchButton,
            isMobile && value && '!right-[2.875rem]',
          )}
          onClick={handleClearSearchInput}
          type="button"
        >
          <X size={14} />
        </button>
      )}
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
          <MagnifyingGlass size={18} />
        </button>
      )}
    </div>
  );
};

SearchInput.displayName = displayName;

export default SearchInput;
