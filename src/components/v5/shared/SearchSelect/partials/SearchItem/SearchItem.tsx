import clsx from 'clsx';
import React from 'react';

import { useMobile } from '~hooks/index.ts';
import {
  hasOptionVisualElement,
  sortDisabled,
} from '~v5/shared/SearchSelect/utils.ts';

import { type SearchItemProps } from './types.ts';

const displayName = 'v5.SearchSelect.partials.SearchItem';

const SearchItem = <T,>({
  options,
  onChange,
  isLabelVisible = true,
  renderOption,
}: SearchItemProps<T>) => {
  const isMobile = useMobile();

  return (
    <ul
      className={clsx({
        'w-full': isLabelVisible,
        '-mx-2 flex flex-wrap items-center gap-y-6 sm:w-[8.75rem]':
          !isLabelVisible,
        'sm:w-[12.75rem]': !isLabelVisible && isMobile,
      })}
    >
      {sortDisabled(options).map((option) => {
        const { value, isDisabled } = option;

        const hasVisual = hasOptionVisualElement(option);

        return (
          <li
            className={clsx('overflow-x-auto', {
              'mb-1 w-full': isLabelVisible,
              'inline-flex w-1/4': !isLabelVisible,
            })}
            key={value}
          >
            <button
              type="button"
              className={clsx(
                'flex w-full items-center rounded px-2 text-left text-md transition-colors hover:bg-gray-50 hover:font-medium',
                {
                  'justify-between': !hasVisual,
                  'justify-start': hasVisual,
                  'pointer-events-none gap-1 text-gray-400': isDisabled,
                  'justify-center': !isLabelVisible,
                  'py-1.5': isLabelVisible,
                },
              )}
              name={value.toString()}
              onClick={() => {
                onChange?.(value);
              }}
            >
              <div className="relative flex w-full items-center">
                {renderOption(option, isLabelVisible, isMobile)}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

SearchItem.displayName = displayName;

export default SearchItem;
