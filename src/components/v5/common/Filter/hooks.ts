import { useCallback, useState } from 'react';

import { FilterOption } from '../TableFiltering/types';
import { contributorTypes, statusTypes } from './partials/consts';

export const useFilter = () => {
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);
  const [selectedChildOption, setSelectedOption] = useState<FilterOption>();

  // useEffect(() => {
  // 	setCheckedState(new Array(selectedFilters.length).fill(false))
  // }, [selectedFilters, setCheckedState])

  const onSaveSelectedFilters = useCallback(
    (event) => {
      let array: FilterOption[] = [...selectedFilters];

      // const updatedCheckedState = checkedState.map((item, index) =>
      // 	{
      // 		console.log(index, event.target?.name, item);
      // 		return index === event.target?.name ? !item : item
      // 	}
      // );

      // setCheckedState(updatedCheckedState);
      // console.log(event);

      if (event.target?.checked) {
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

  const onSelectParentFilter = useCallback(() => {
    // @TODO: id of selected parent filter element
  }, []);

  const onSelectNestedOption = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onSaveSelectedFilters(event);
    },
    [onSaveSelectedFilters],
  );

  // @TODO: check other filter types
  const isContributorTypeSelected = contributorTypes.some(
    ({ id }) => id === selectedChildOption,
  );
  const isStatusTypeSelected = statusTypes.some(
    ({ id }) => id === selectedChildOption,
  );

  // @TODO: add other filter types
  const numberSelectedFilters = [
    isContributorTypeSelected,
    isStatusTypeSelected,
  ].filter(Boolean).length;

  return {
    selectedFilters: [...new Set(selectedFilters)],
    onSelectParentFilter,
    onSelectNestedOption,
    onClearFilters,
    selectedChildOption,
    numberSelectedFilters,
  };
};
