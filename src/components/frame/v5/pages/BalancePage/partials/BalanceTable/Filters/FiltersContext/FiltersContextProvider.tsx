import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { getObjectValues } from '~utils/objects/index.ts';

import { FiltersContext, type FiltersContextValue } from './FiltersContext.ts';
import {
  FiltersValues,
  type BalanceTableFilters,
  type BalanceFilterType,
} from './types.ts';

const FilterContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState('');

  const [filters, setFilters] = useState<BalanceTableFilters>({
    search: '',
    attribute: {
      native: false,
      reputation: false,
    },
    token: {},
    chain: {},
  });

  const handleFiltersChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, type: BalanceFilterType) => {
      const isChecked = event.target.checked;
      const { name } = event.target;

      setFilters((state) => ({
        ...state,
        [type]: {
          ...state[type],
          [name]: isChecked,
        },
      }));
    },
    [],
  );

  const activeFilters: BalanceTableFilters = useMemo(() => {
    return {
      attribute: filters.attribute,
      chain: filters.chain,
      token: filters.token,
      search: '',
    };
  }, [filters.attribute, filters.chain, filters.token]);

  const handleResetFilters = useCallback((filter: FiltersValues) => {
    switch (filter) {
      case FiltersValues.TokenType: {
        return setFilters((state) => ({
          ...state,
          token: {},
        }));
      }
      case FiltersValues.Attributes: {
        return setFilters((state) => ({
          ...state,
          attribute: {
            native: false,
            reputation: false,
          },
        }));
      }
      case FiltersValues.Chain: {
        return setFilters((state) => ({
          ...state,
          chain: {},
        }));
      }
      default: {
        return undefined;
      }
    }
  }, []);

  const selectedFiltersCount =
    getObjectValues(filters.token).filter((filter) => filter).length +
    getObjectValues(filters.attribute).filter((filter) => filter).length +
    getObjectValues(filters.chain).filter((filter) => filter).length;

  const value = useMemo<FiltersContextValue>(
    () => ({
      searchFilter,
      setSearchFilter,
      activeFilters,
      selectedFiltersCount,
      handleResetFilters,
      filters,
      handleFiltersChange,
    }),
    [
      searchFilter,
      activeFilters,
      selectedFiltersCount,
      handleResetFilters,
      filters,
      handleFiltersChange,
    ],
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};

export default FilterContextProvider;
