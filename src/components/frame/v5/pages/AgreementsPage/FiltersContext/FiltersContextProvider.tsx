import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { type MotionState } from '~utils/colonyMotions.ts';

import {
  type AgreementsPageFilters,
  type DateOptions,
} from '../partials/AgreementsPageFilters/types.ts';
import { getDateFilter } from '../partials/AgreementsPageFilters/utils.ts';

import { MOTION_FILTERS } from './consts.ts';
import { FiltersContext } from './FiltersContext.ts';
import { FiltersValues } from './types.ts';

const emptyDateFilters: DateOptions = {
  pastHour: false,
  pastDay: false,
  pastWeek: false,
  pastMonth: false,
  pastYear: false,
  custom: undefined,
};

const FiltersContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [motionStates, setMotionStates] = useState<MotionState[]>([]);
  const [dateFilters, setDateFilters] = useState<DateOptions>(emptyDateFilters);

  const handleMotionStatesFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as MotionState;

      if (isChecked) {
        setMotionStates([...motionStates, ...MOTION_FILTERS[name]]);
      } else {
        setMotionStates(
          motionStates.filter(
            (checkedItem) => !MOTION_FILTERS[name].includes(checkedItem),
          ),
        );
      }
    },
    [motionStates],
  );

  const handleDateFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as keyof DateOptions;

      if (isChecked) {
        setDateFilters({ ...emptyDateFilters, [name]: true });
      } else {
        setDateFilters(emptyDateFilters);
      }
    },
    [],
  );

  const handleCustomDateFilterChange = useCallback(
    (date: [Date | null, Date | null]) => {
      const [newStartDate, newEndDate] = date;

      if (newStartDate && newEndDate) {
        setDateFilters({
          ...emptyDateFilters,
          custom:
            !newStartDate && !newEndDate
              ? undefined
              : [newStartDate.toString(), newEndDate.toString()],
        });
      }
    },
    [],
  );

  const activeFilters: AgreementsPageFilters = useMemo(() => {
    const date = getDateFilter(dateFilters);

    return {
      ...(motionStates.length ? { motionStates } : {}),
      ...(searchFilter ? { search: searchFilter } : {}),
      ...(date || {}),
    };
  }, [motionStates, searchFilter, dateFilters]);

  const handleResetFilters = useCallback((filter: FiltersValues) => {
    switch (filter) {
      case FiltersValues.Status: {
        return setMotionStates([]);
      }
      case FiltersValues.Date:
      case FiltersValues.Custom: {
        return setDateFilters(emptyDateFilters);
      }
      default: {
        return undefined;
      }
    }
  }, []);

  const motionsCount = motionStates.reduce((acc, current) => {
    if (MOTION_FILTERS[current]) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const selectedFiltersCount =
    motionsCount + Object.values(dateFilters).filter(Boolean).length;

  const value = useMemo(
    () => ({
      searchFilter,
      setSearchFilter,
      dateFilters,
      motionStates,
      activeFilters,
      selectedFiltersCount,
      handleMotionStatesFilterChange,
      handleResetFilters,
      handleDateFilterChange,
      handleCustomDateFilterChange,
    }),
    [
      searchFilter,
      motionStates,
      dateFilters,
      activeFilters,
      selectedFiltersCount,
      handleMotionStatesFilterChange,
      handleResetFilters,
      handleDateFilterChange,
      handleCustomDateFilterChange,
    ],
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};

export default FiltersContextProvider;
