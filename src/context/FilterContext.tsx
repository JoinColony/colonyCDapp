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
  checkedItems: Map<string | undefined, boolean>;
  selectedChildOption: FilterOption;
  isFollowersPage: boolean;
  onClearFilters: () => void;
  onMobileSelectParentFilter: (id: FilterType) => void;
  onSelectNestedOption: (
    event: React.ChangeEvent<HTMLInputElement>,
    selectedNestedOption: FilterType,
  ) => void;
  numberSelectedFilters: number;
  teamSelectedOptions: unknown;
}>({
  selectedFilters: [],
  selectedParentFilters: [],
  checkedItems: new Map(),
  selectedChildOption: undefined,
  isFollowersPage: false,
  onClearFilters: noop,
  onMobileSelectParentFilter: noop,
  onSelectNestedOption: noop,
  numberSelectedFilters: 0,
  teamSelectedOptions: { value: 0, label: undefined },
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

  const onMobileSelectParentFilter = useCallback((id: FilterType) => {
    setSelectedParentFilter((prev: FilterType[]) => [...prev, id]);
  }, []);

  const onSelectNestedOption = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      selectedNestedOption: FilterType,
    ) => {
      onSaveSelectedFilters(event);
      setSelectedParentFilter(selectedNestedOption);
    },
    [onSaveSelectedFilters, setSelectedParentFilter],
  );

  const isContributorTypeSelected = contributorTypes.some(
    ({ value }) => value === selectedChildOption,
  );
  const isStatusTypeSelected = statusTypes.some(
    ({ value }) => value === selectedChildOption,
  );

  const isTeamTypeSelected = teamTypes.some(
    (value) => value === selectedChildOption,
  );

  const isPermissionsTypeSelected = permissionsTypes.some(
    ({ value }) => value === selectedChildOption,
  );

  const isReputationTypeSelected = reputationType.some(
    ({ value }) => value === selectedChildOption,
  );

  const numberSelectedFilters = [
    isTeamTypeSelected,
    isContributorTypeSelected,
    isStatusTypeSelected,
    isReputationTypeSelected,
    isPermissionsTypeSelected,
  ].filter(Boolean).length;

  const mappedTeamSelectedOptions = useCallback(() => {
    return [...selectedFilters]?.map((filterData) => {
      if (filterData === 'Root') {
        return {
          value: 1,
          label: filterData,
        };
      }
      if (filterData === 'Procurement') {
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
      if (filterData === 'Pagepro') {
        return {
          value: 5,
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
      onMobileSelectParentFilter,
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
      onMobileSelectParentFilter,
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
