import { utils } from 'ethers';
import { useMemo } from 'react';

import { formatText } from '~utils/intl.ts';

import { type SearchSelectOptionProps } from './types.ts';

export const useSearchSelect = (
  items: SearchSelectOptionProps[],
  searchValue: string,
  shouldReturnAddresses: boolean,
) => {
  const searchedOptions = useMemo(
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

        const options = (() => {
          if (filteredOptions.length > 0) {
            return filteredOptions;
          }

          if (
            shouldReturnAddresses &&
            searchValue &&
            utils.isHexString(searchValue)
          ) {
            // Return search value as an option
            return [
              {
                ...item.options[0],
                avatar: item.options[0]?.showAvatar ? '' : undefined,
                value: searchValue,
                label: searchValue,
                walletAddress: searchValue,
              },
            ];
          }

          return [];
        })();

        return {
          ...item,
          options,
        };
      }),
    [items, searchValue, shouldReturnAddresses],
  );

  const filteredOptions = useMemo(
    () => searchedOptions.filter((item) => item.options.length > 0),
    [searchedOptions],
  );

  return filteredOptions;
};
