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
  showSearchValueAsOption?: boolean,
) => {
  const searchedOptions = useMemo(() => {
    const normalizeOptionValue = (value) =>
      typeof value === 'string'
        ? value.toLowerCase().replace('-', ' ')
        : value.toString();

    const normalizeOptionLabel = (label) => formatText(label).toLowerCase();

    const matchesSearch = (value, searchQuery) => value.includes(searchQuery);

    const getFallbackOption = (item) => ({
      ...item.options[0],
      avatar:
        isUserSearchSelectOption(item.options[0]) && item.options[0].showAvatar
          ? ''
          : undefined,
      value: searchValue,
      label: searchValue,
      walletAddress: searchValue,
    });

    const searchQuery = searchValue.toLowerCase();

    return items.map((item) => {
      const filteredOptions = item.options.filter((option) =>
        [
          normalizeOptionValue(option.value),
          normalizeOptionLabel(option.label),
        ].some((value) => matchesSearch(value, searchQuery)),
      );
      const shouldShowFallback =
        searchValue &&
        !filteredOptions.length &&
        showSearchValueAsOption &&
        utils.isHexString(searchValue) &&
        item.options[0];

      return {
        ...item,
        options: shouldShowFallback
          ? [getFallbackOption(item)]
          : filteredOptions,
      };
    });
  }, [items, searchValue, showSearchValueAsOption]);

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

export const useSearch = (onSearch?: (value: string) => void) => {
  const [searchValue, setSearchValue] = useState('');
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
