import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import noop from '~utils/noop';
import {
  contributorTypes,
  permissionsTypes,
  reputationType,
  statusTypes,
  teamTypes,
} from '~v5/common/Filter/partials/consts';
import { FilterOption, FilterType } from '~v5/common/TableFiltering/types';

export const FilterContext = createContext<{
  selectedFilters: FilterOption[];
  selectedParentFilters: FilterType | FilterType[];
  checkedItems: Map<string, boolean>;
  selectedChildOption: FilterOption;
  isFollowersPage: boolean;
  onClearFilters: () => void;
  onSelectParentFilter: (id: FilterType) => void;
  onSelectNestedOption: (event: React.ChangeEvent<HTMLInputElement>) => void;
  numberSelectedFilters: number;
  teamSelectedOptions: { value: number; label: FilterOption };
}>({
  selectedFilters: [],
  selectedParentFilters: [],
  checkedItems: new Map(),
  selectedChildOption: '' as FilterOption,
  isFollowersPage: false,
  onClearFilters: noop,
  onSelectParentFilter: noop,
  onSelectNestedOption: noop,
  numberSelectedFilters: 0,
  teamSelectedOptions: { value: 0, label: '' as FilterOption },
});

export const FilterContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);
  const [selectedChildOption, setSelectedOption] = useState<FilterOption>();
  const [selectedParentFilters, setSelectedParentFilter] = useState<
    FilterType | FilterType[]
  >([]);
  const [checkedItems, setCheckedItems] = useState<Map<string, boolean>>(
    new Map(),
  );
  const location = useLocation();
  const isFollowersPage = location.pathname.includes('followers');

  const onSaveSelectedFilters = useCallback(
    (event) => {
      let array: FilterOption[] = [...selectedFilters];

      const item = event.target.id;
      const isChecked = event.target.checked;

      setCheckedItems((prevState) => new Map(prevState).set(item, isChecked));

      if (isChecked) {
        array = [...selectedFilters, event.target?.name];
        setSelectedOption(event.target?.name);
      } else {
        array.splice(selectedFilters.indexOf(event.target?.name), 1);
        setSelectedOption(undefined);
      }
      setSelectedFilters(array);
    },
    [selectedFilters, setSelectedFilters],
  );

  const onClearFilters = useCallback(() => {
    setSelectedFilters([]);
    setSelectedOption(undefined);
    setCheckedItems(new Map());
  }, []);

  const onSelectParentFilter = useCallback((id: FilterType) => {
    setSelectedParentFilter((prev: FilterType[]) => [...prev, id]);
  }, []);

  const onSelectNestedOption = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onSaveSelectedFilters(event);
    },
    [onSaveSelectedFilters],
  );

  const isContributorTypeSelected = contributorTypes.some(
    ({ id }) => id === selectedChildOption,
  );
  const isStatusTypeSelected = statusTypes.some(
    ({ id }) => id === selectedChildOption,
  );

  const isTeamTypeSelected = teamTypes.some(
    ({ id }) => id === selectedChildOption,
  );

  const isPermissionsTypeSelected = permissionsTypes.some(
    ({ id }) => id === selectedChildOption,
  );

  const isReputationTypeSelected = reputationType.some(
    ({ id }) => id === selectedChildOption,
  );

  const numberSelectedFilters = [
    isTeamTypeSelected,
    isContributorTypeSelected,
    isStatusTypeSelected,
    isReputationTypeSelected,
    isPermissionsTypeSelected,
  ].filter(Boolean).length;

  const mappedTeamSelectedOptions = useCallback(() => {
    // @TODO: fix that when API will be returns all needed filters
    return [...selectedFilters]?.map((filterData) => {
      if (filterData === 'Root') {
        return {
          value: 1,
          label: filterData,
        };
      }
      if (filterData === 'Business') {
        return {
          value: 2,
          label: filterData,
        };
      }
      if (filterData === 'Design') {
        return {
          value: 3,
          label: filterData,
        };
      }
      if (filterData === 'Development') {
        return {
          value: 4,
          label: filterData,
        };
      }
      if (filterData === 'Devops') {
        return {
          value: 5,
          label: filterData,
        };
      }
      if (filterData === 'Product') {
        return {
          value: 6,
          label: filterData,
        };
      }
      return {};
    });
  }, [selectedFilters]);

  const teamSelectedOptions = mappedTeamSelectedOptions();

  const value = useMemo(
    () => ({
      selectedFilters,
      selectedParentFilters,
      selectedChildOption,
      checkedItems,
      isFollowersPage,
      onClearFilters,
      onSelectParentFilter,
      onSelectNestedOption,
      numberSelectedFilters,
      teamSelectedOptions,
    }),
    [
      selectedFilters,
      selectedParentFilters,
      selectedChildOption,
      checkedItems,
      isFollowersPage,
      onClearFilters,
      onSelectParentFilter,
      onSelectNestedOption,
      numberSelectedFilters,
      teamSelectedOptions,
    ],
  );

  return (
    <FilterContext.Provider {...{ value }}>{children}</FilterContext.Provider>
  );
};

export const useFilterContext = () => useContext(FilterContext);
