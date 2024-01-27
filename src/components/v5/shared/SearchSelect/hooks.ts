import { useMemo } from 'react';

import { formatText } from '~utils/intl.ts';

import { SearchSelectOptionProps } from './types.ts';

export const useSearchSelect = (
  items: SearchSelectOptionProps[],
  searchValue: string,
) => {
  const searchedOptions = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        options: item.options.filter((option) => {
          const searchQuery = searchValue.toLowerCase();
          const optionValue =
            typeof option.value === 'string'
              ? option.value.replace('-', ' ').toLowerCase()
              : option.value;
          const optionUserName = formatText(option.label).toLowerCase();

          return [optionValue, optionUserName].some((value) =>
            value.toString().includes(searchQuery),
          );
        }),
      })),
    [items, searchValue],
  );

  const filteredOptions = useMemo(
    () => searchedOptions.filter((item) => item.options.length > 0),
    [searchedOptions],
  );

  return filteredOptions;
};
