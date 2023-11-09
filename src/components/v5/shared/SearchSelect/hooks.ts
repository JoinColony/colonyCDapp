import { useMemo } from 'react';
import { SearchSelectOptionProps } from './types';
import { formatText } from '~utils/intl';

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
          const optionWalletAddress = option.walletAddress?.toLowerCase() || '';
          const optionUserName = formatText(option.label)?.toLowerCase() || '';

          return (
            [optionUserName].some((value) => value.includes(searchQuery)) ||
            optionWalletAddress.startsWith(searchQuery)
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
