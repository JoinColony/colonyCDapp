import React, {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';

import {
  type AttributeFilters,
  FiltersValues,
  type TokenTypes,
  type BalanceTableFilters,
} from './types.ts';

interface FiltersContextValue {
  searchFilter: string;
  setSearchFilter: (searchValue: string) => void;
  tokenTypes: TokenTypes;
  attributeFilters: AttributeFilters;
  activeFilters: BalanceTableFilters;
  selectedFiltersCount: number;
  handleAttributeFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleTokenTypesFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleResetFilters: (filter: FiltersValues) => void;
}

export const FiltersContext = createContext<FiltersContextValue | undefined>(
  undefined,
);

export const FiltersContextProvider: FC<PropsWithChildren> = ({ children }) => {
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

export const useFiltersContext = () => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error(
      'useFiltersContext must be used within the FiltersContextProvider',
    );
  }
  return context;
};
