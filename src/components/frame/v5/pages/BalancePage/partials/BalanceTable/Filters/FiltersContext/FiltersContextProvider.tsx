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
  type TBalanceTableFilters,
  type TBalanceFilter,
} from './types.ts';

const FilterContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState('');

  const [filters, setFilters] = useState<TBalanceTableFilters>({
    attribute: {
      native: {
        isChecked: false,
      },
      reputation: {
        isChecked: false,
      },
    },
    token: {},
    chain: {},
  });

  const handleFiltersChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, type: TBalanceFilter) => {
      const isChecked = event.target.checked;
      const { name, id } = event.target;

      setFilters((state) => ({
        ...state,
        [type]: {
          ...state[type],
          [name]: {
            isChecked,
            id,
          },
        },
      }));
    },
    [],
  );

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
            native: {
              isChecked: false,
            },
            reputation: {
              isChecked: false,
            },
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
    getObjectValues(filters.token).filter(({ isChecked }) => isChecked).length +
    getObjectValues(filters.attribute).filter(({ isChecked }) => isChecked)
      .length +
    getObjectValues(filters.chain).filter(({ isChecked }) => isChecked).length;

  const value = useMemo<FiltersContextValue>(
    () => ({
      searchFilter,
      setSearchFilter,
      selectedFiltersCount,
      handleResetFilters,
      filters,
      handleFiltersChange,
    }),
    [
      searchFilter,
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
