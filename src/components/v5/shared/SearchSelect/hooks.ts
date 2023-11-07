import { useMemo } from 'react';
import { SearchSelectOptionProps } from './types';

export const useSearchSelect = (
  items: SearchSelectOptionProps[],
  searchValue: string,
) => {
  const searchedOptions = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        options: item.options.filter((option) => {
          const optionValue = option.value.replace('-', ' ');
          const optionWalletAddress = option.walletAddress || '';
          const optionUserName = option.label || '';

          return (
            optionValue.toLowerCase().includes(searchValue.toLowerCase()) ||
            optionWalletAddress
              .toLowerCase()
              .startsWith(searchValue?.toLowerCase() ?? '') ||
            (typeof optionUserName === 'string'
              ? optionUserName
                  .toLowerCase()
                  .includes(searchValue?.toLowerCase())
              : undefined)
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
