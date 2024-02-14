import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { FiltersContext } from './FiltersContext.ts';
import {
  type AttributeFilters,
  FiltersValues,
  type TokenTypes,
  type BalanceTableFilters,
} from './types.ts';

const FilterContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [tokenTypes, setTokenTypes] = useState<TokenTypes>({});
  const [attributeFilters, setAttributeFilters] = useState<AttributeFilters>({
    native: false,
    reputation: false,
  });

  const handleTokenTypesFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as keyof TokenTypes;

      if (isChecked) {
        setTokenTypes({ ...tokenTypes, [name]: true });
      } else {
        setTokenTypes({ ...tokenTypes, [name]: false });
      }
    },
    [tokenTypes],
  );

  const handleAttributeFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as keyof AttributeFilters;

      if (isChecked) {
        setAttributeFilters({ ...attributeFilters, [name]: true });
      } else {
        setAttributeFilters({ ...attributeFilters, [name]: false });
      }
    },
    [attributeFilters],
  );

  const activeFilters: BalanceTableFilters = useMemo(() => {
    return {
      ...(Object.keys(tokenTypes).length ? { tokenTypes } : {}),
      ...(Object.keys(attributeFilters).length ? { attributeFilters } : {}),
      ...(searchFilter ? { search: searchFilter } : {}),
    };
  }, [tokenTypes, attributeFilters, searchFilter]);

  const handleResetFilters = useCallback((filter: FiltersValues) => {
    switch (filter) {
      case FiltersValues.TokenType: {
        return setTokenTypes({});
      }
      case FiltersValues.Attributes: {
        return setAttributeFilters({
          native: false,
          reputation: false,
        });
      }
      default: {
        return undefined;
      }
    }
  }, []);

  const selectedFiltersCount =
    Object.values(tokenTypes).filter((value) => value === true).length +
    Object.values(attributeFilters).filter((value) => value === true).length;

  const value = useMemo(
    () => ({
      searchFilter,
      setSearchFilter,
      tokenTypes,
      attributeFilters,
      activeFilters,
      selectedFiltersCount,
      handleAttributeFilterChange,
      handleTokenTypesFilterChange,
      handleResetFilters,
    }),
    [
      searchFilter,
      tokenTypes,
      attributeFilters,
      activeFilters,
      selectedFiltersCount,
      handleAttributeFilterChange,
      handleTokenTypesFilterChange,
      handleResetFilters,
    ],
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};

export default FilterContextProvider;
