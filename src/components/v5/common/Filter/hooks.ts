import { useCallback, useState } from 'react';

import { FilterOption } from '../TableFiltering/types';

export const useFilter = () => {
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);

  const onSaveSelectedFilters = useCallback(
    (event) => {
      let array: FilterOption[] = [...selectedFilters];

      if (event.target?.checked) {
        array = [...selectedFilters, event.target?.id];
      } else {
        array.splice(selectedFilters.indexOf(event.target?.id), 1);
      }
      setSelectedFilters(array);
    },
    [selectedFilters, setSelectedFilters],
  );

  const onClearFilters = useCallback(() => {
    setSelectedFilters([]);
  }, []);

  return {
    selectedFilters: [...new Set(selectedFilters)],
    onSaveSelectedFilters,
    onClearFilters,
  };
};
