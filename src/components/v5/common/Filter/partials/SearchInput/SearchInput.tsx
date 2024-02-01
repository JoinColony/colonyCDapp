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
import Icon from '~shared/Icon/index.ts';

import { type SearchInputProps } from './types.ts';

import styles from './SearchInput.module.css';

const displayName = 'v5.common.Filter.partials.SearchInput';

const SearchInput: FC<SearchInputProps> = ({
  onSearchButtonClick,
  setSearchValue,
  searchValue,
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
          isMobile && value && '!pr-[5.375rem]',
        )}
        type="text"
        onInput={onInput}
        placeholder={formatMessage({ id: 'filter.input.placeholder' })}
        defaultValue={searchValue}
      />
      {showClearButton && (
        <button
          className={clsx(
            styles.clearSearchButton,
            isMobile && value && '!right-[3.25rem]',
          )}
          onClick={handleClearSearchInput}
          type="button"
        >
          <Icon name="close" appearance={{ size: 'extraExtraTiny' }} />
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
          <Icon name="magnifying-glass" appearance={{ size: 'small' }} />
        </button>
      )}
    </div>
  );
};

SearchInput.displayName = displayName;

export default SearchInput;
