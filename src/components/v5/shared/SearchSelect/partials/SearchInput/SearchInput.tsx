import React, { FC, useLayoutEffect, useRef } from 'react';

import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import InputBase from '~v5/common/Fields/InputBase';
import { SearchInputProps } from './types';

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
        className="px-[2.125rem] rounded-lg w-full text-3 peer focus:shadow-[0px_0px_0px_3px_#EFF8FF]"
        placeholder={placeholder}
        value={value}
        ref={searchInputRef}
        suffix={
          <span className="absolute top-[.6875rem] left-3 flex text-gray-400 peer-focus:text-gray-900">
            <Icon name="magnifying-glass" appearance={{ size: 'tiny' }} />
          </span>
        }
        prefix={
          value ? (
            <button
              className="absolute top-0 right-0 flex h-[2.25rem] w-[2.25rem] justify-center items-center"
              onClick={() => {
                if (searchInputRef.current) {
                  searchInputRef?.current?.focus();
                }

                onChange?.('');
              }}
              type="button"
            >
              <Icon name="close" appearance={{ size: 'extraExtraTiny' }} />
            </button>
          ) : undefined
        }
      />
    </div>
  );
};

SearchInput.displayName = displayName;

export default SearchInput;
