import { MagnifyingGlass, X } from '@phosphor-icons/react';
import React, { type FC, useLayoutEffect, useRef } from 'react';

import { formatText } from '~utils/intl.ts';
import InputBase from '~v5/common/Fields/InputBase/index.ts';

import { type SearchInputProps } from './types.ts';

const displayName = 'v5.SearchSelect.partials.SearchInput';

const SearchInput: FC<SearchInputProps> = ({
  onChange,
  value,
  placeholder = formatText({ id: 'placeholder.search' }),
  shouldFocus = false,
  ...props
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (searchInputRef.current && shouldFocus) {
      searchInputRef?.current?.focus();
    }
  }, [shouldFocus]);

  return (
    <div className="relative w-full">
      <InputBase
        {...props}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        className="peer w-full rounded-lg px-[2.125rem] text-3"
        placeholder={placeholder}
        value={value}
        ref={searchInputRef}
        suffix={
          <span className="absolute left-3 top-[.6875rem] flex text-gray-400 peer-focus:text-gray-900">
            <MagnifyingGlass size={14} />
          </span>
        }
        prefix={
          value ? (
            <button
              className="absolute right-0 top-0 flex h-[2.25rem] w-[2.25rem] items-center justify-center"
              onClick={() => {
                if (searchInputRef.current) {
                  searchInputRef?.current?.focus();
                }

                onChange?.('');
              }}
              type="button"
            >
              <X size={10} />
            </button>
          ) : undefined
        }
      />
    </div>
  );
};

SearchInput.displayName = displayName;

export default SearchInput;
