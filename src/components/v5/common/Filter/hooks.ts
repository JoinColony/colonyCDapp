import { useCallback, useState } from 'react';

import { FilterOption, FilterType } from '../TableFiltering/types';
import {
  contributorTypes,
  permissionsTypes,
  reputationType,
  statusTypes,
  teamTypes,
} from './partials/consts';

export const useFilter = () => {
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);
  const [selectedChildOption, setSelectedOption] = useState<FilterOption>();
  const [selectedParentFilter, setSelectedParentFilter] = useState<
    FilterType | FilterType[]
  >();
  const [checkedItems, setCheckedItems] = useState<Map<string, boolean>>(
    new Map(),
  );

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
  }, []);

  const onSelectParentFilter = useCallback((id: FilterType) => {
    setSelectedParentFilter(id);
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

  return {
    selectedFilters: [...new Set(selectedFilters)],
    onSelectParentFilter,
    onSelectNestedOption,
    onClearFilters,
    selectedChildOption,
    numberSelectedFilters,
    selectedParentFilter,
    checkedItems,
  };
};
