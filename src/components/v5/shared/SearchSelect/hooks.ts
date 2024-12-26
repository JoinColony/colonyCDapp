import { utils } from 'ethers';
import debounce from 'lodash/debounce';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { formatText } from '~utils/intl.ts';

import {
  isUserSearchSelectOption,
  type SearchSelectOptionProps,
} from './types.ts';

export const useFilterItems = <T>(
  items: SearchSelectOptionProps<T>[],
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
                avatar:
                  isUserSearchSelectOption(item.options[0]) &&
                  item.options[0]?.showAvatar
                    ? ''
                    : undefined,
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

export const useAccordion = <T>(items: SearchSelectOptionProps<T>[]) => {
  const defaultOpenedAccordions = useMemo(
    () => items.filter(({ isAccordion }) => isAccordion).map(({ key }) => key),
    [items],
  );

  const [openedAccordions, setOpenedAccordions] = useState<string[]>(
    defaultOpenedAccordions,
  );

  const onAccordionClick = useCallback((key: string) => {
    setOpenedAccordions((prev) => {
      if (prev.includes(key)) {
        return prev.filter((item) => item !== key);
      }

      return [...prev, key];
    });
  }, []);

  return { openedAccordions, onAccordionClick };
};

export const useSearch = (
  initialSearchValue: string,
  onSearch?: (value: string) => void,
) => {
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchValue]);

  const handleSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearchValue(value), 500),
    [],
  );

  const onChange = useCallback(
    (value: string) => {
      onSearch?.(value);
      setSearchValue(value);
      if (value) {
        handleSearch(value);
      } else {
        setDebouncedSearchValue('');
      }
    },
    [handleSearch, onSearch],
  );

  return { searchValue, debouncedSearchValue, onChange };
};
