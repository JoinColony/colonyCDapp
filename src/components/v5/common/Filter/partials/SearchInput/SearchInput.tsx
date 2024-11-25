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
    <div className='group relative flex w-full justify-end bg-base-white text-md text-3 after:absolute after:-left-[0.1875rem] after:-top-[0.1875rem] after:block after:h-[calc(100%+0.1875rem+0.1875rem)] after:w-[calc(100%+0.1875rem+0.1875rem)] after:rounded-xl after:border-[0.1875rem] after:border-transparent after:transition-all after:duration-normal after:content-[""] focus-within:border-blue-100 hover:after:border-blue-100'>
      <span className="pointer-events-none absolute left-3 top-[50%] z-mid flex translate-y-[-50%] text-gray-900 sm:left-[0.75rem] sm:text-gray-500">
        <MagnifyingGlass size={14} />
      </span>
      <input
        ref={ref}
        className={clsx(
          'z-base min-h-8.5 w-full rounded-lg border border-gray-300 bg-base-white px-8.5 py-1.5 placeholder:text-gray-400 focus:outline-none group-focus-within:border-blue-200 group-hover:border-blue-200',
          isMobile && value && '!pr-[5.375rem]',
        )}
        type="text"
        onInput={onInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearchButtonClick();
          }
        }}
        placeholder={searchInputPlaceholder}
        defaultValue={searchValue}
      />
      {showClearButton && (
        <button
          className={clsx(
            'absolute right-0 top-0 z-base flex h-[2.25rem] w-[2.375rem] items-center justify-center text-gray-900',
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
          className="absolute right-0 top-0 z-base flex h-full items-center justify-center rounded-lg bg-blue-400 px-3.5 text-base-white transition-all duration-normal sm:text-gray-500"
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
