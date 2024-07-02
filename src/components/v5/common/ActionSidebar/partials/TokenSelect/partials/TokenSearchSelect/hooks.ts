import { useMemo } from 'react';

import { formatText } from '~utils/intl.ts';

import { type TokenSearchSelectOptionProps } from './types.ts';

export const useSearchSelect = (
  items: TokenSearchSelectOptionProps[],
  searchValue: string,
) => {
  const searchedOptions: TokenSearchSelectOptionProps[] = useMemo(
    () =>
      items.map((item) => {
        const filteredOptions = item.options.filter((option) => {
          const searchQuery = searchValue.toLowerCase();
          const optionValue =
            typeof option.value === 'string'
              ? option.value.replace('-', ' ').toLowerCase()
              : option.value;
          const optionUserName = formatText(option.label).toLowerCase();

          return [optionValue, optionUserName].some((value) =>
            value.toString().includes(searchQuery),
          );
        });

        return {
          ...item,
          options: filteredOptions,
        };
      }),
    [items, searchValue],
  );

  const filteredOptions = useMemo(
    () => searchedOptions.filter((item) => item.options.length > 0),
    [searchedOptions],
  );

  return filteredOptions;
};
