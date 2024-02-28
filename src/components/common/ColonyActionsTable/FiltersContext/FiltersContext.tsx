import React, {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { type Action } from '~constants/actions.ts';
import { ACTION_TYPE_TO_API_ACTION_TYPES_MAP } from '~constants/actionsFilters.ts';
import {
  type ActivityFeedFilters,
  type ActivityDecisionMethod,
} from '~hooks/useActivityFeed/types.ts';
import { type AnyActionType } from '~types/actions.ts';
import { type MotionState } from '~utils/colonyMotions.ts';

import { type DateOptions } from '../partials/ActionsTableFilters/types.ts';
import { getDateFilter } from '../utils.ts';

import { FiltersValues } from './types.ts';

interface FiltersContextValue {
  searchFilter: string;
  setSearchFilter: (searchValue: string) => void;
  motionStates: MotionState[];
  decisionMethod: ActivityDecisionMethod | undefined;
  actionTypesFilters: Action[];
  dateFilters: DateOptions;
  activeFilters: ActivityFeedFilters;
  selectedFiltersCount: number;
  handleActionTypesFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleDecisionMethodFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleMotionStatesFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleDateFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomDateFilterChange: (date: [Date | null, Date | null]) => void;
  handleResetFilters: (filter: FiltersValues) => void;
}

export const FiltersContext = createContext<FiltersContextValue | undefined>(
  undefined,
);

export const FiltersContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [motionStates, setMotionStates] = useState<MotionState[]>([]);
  const [decisionMethod, setDecisionMethod] = useState<
    ActivityDecisionMethod | undefined
  >();
  const [actionTypesFilters, setActionTypesFilters] = useState<Action[]>([]);
  const [dateFilters, setDateFilters] = useState<DateOptions>({
    pastHour: false,
    pastDay: false,
    pastWeek: false,
    pastMonth: false,
    pastYear: false,
    custom: undefined,
  });

  const handleActionTypesFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as Action;

      if (isChecked) {
        setActionTypesFilters([...actionTypesFilters, name]);
      } else {
        setActionTypesFilters(
          actionTypesFilters.filter((checkedItem) => checkedItem !== name),
        );
      }
    },
    [actionTypesFilters],
  );

  const handleMotionStatesFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as MotionState;

      if (isChecked) {
        setMotionStates([...motionStates, name]);
      } else {
        setMotionStates(
          motionStates.filter((checkedItem) => checkedItem !== name),
        );
      }
    },
    [motionStates],
  );

  const handleDecisionMethodFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as ActivityDecisionMethod;

      if (isChecked) {
        setDecisionMethod(name);
      } else {
        setDecisionMethod(undefined);
      }
    },
    [],
  );

  const handleDateFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as keyof DateOptions;

      if (isChecked) {
        setDateFilters({ ...dateFilters, [name]: true });
      } else {
        setDateFilters({ ...dateFilters, [name]: false });
      }
    },
    [dateFilters],
  );

  const handleCustomDateFilterChange = useCallback(
    (date: [Date | null, Date | null]) => {
      const [newStartDate, newEndDate] = date;

      if (newStartDate && newEndDate) {
        setDateFilters({
          ...dateFilters,
          custom:
            !newStartDate && !newEndDate
              ? undefined
              : [newStartDate.toString(), newEndDate.toString()],
        });
      }
    },
    [dateFilters],
  );

  const activeFilters: ActivityFeedFilters = useMemo(() => {
    const date = getDateFilter(dateFilters);
    const actionTypes = actionTypesFilters.reduce<AnyActionType[]>(
      (result, actionType) => {
        const apiActionTypes = ACTION_TYPE_TO_API_ACTION_TYPES_MAP[actionType];

        if (!apiActionTypes) {
          return result;
        }

        return [...result, ...apiActionTypes];
      },
      [],
    );

    return {
      ...(motionStates.length ? { motionStates } : {}),
      ...(actionTypes.length ? { actionTypes } : {}),
      ...(date || {}),
      ...(decisionMethod
        ? {
            decisionMethod,
          }
        : {}),
      ...(searchFilter ? { search: searchFilter } : {}),
    };
  }, [
    actionTypesFilters,
    dateFilters,
    decisionMethod,
    motionStates,
    searchFilter,
  ]);

  const handleResetFilters = useCallback((filter: FiltersValues) => {
    switch (filter) {
      case FiltersValues.ActionType: {
        return setActionTypesFilters([]);
      }
      case FiltersValues.Status: {
        return setMotionStates([]);
      }
      case FiltersValues.DecisionMethod: {
        return setDecisionMethod(undefined);
      }
      case FiltersValues.Date:
      case FiltersValues.Custom: {
        return setDateFilters({
          pastHour: false,
          pastDay: false,
          pastWeek: false,
          pastMonth: false,
          pastYear: false,
          custom: undefined,
        });
      }
      default: {
        return undefined;
      }
    }
  }, []);

  const selectedFiltersCount =
    actionTypesFilters.length +
    motionStates.length +
    Number(!!decisionMethod) +
    Object.values(dateFilters).filter(Boolean).length;

  const value = useMemo(
    () => ({
      searchFilter,
      setSearchFilter,
      motionStates,
      decisionMethod,
      actionTypesFilters,
      dateFilters,
      activeFilters,
      selectedFiltersCount,
      handleActionTypesFilterChange,
      handleDecisionMethodFilterChange,
      handleMotionStatesFilterChange,
      handleDateFilterChange,
      handleCustomDateFilterChange,
      handleResetFilters,
    }),
    [
      searchFilter,
      motionStates,
      decisionMethod,
      actionTypesFilters,
      dateFilters,
      activeFilters,
      selectedFiltersCount,
      handleActionTypesFilterChange,
      handleDecisionMethodFilterChange,
      handleMotionStatesFilterChange,
      handleDateFilterChange,
      handleCustomDateFilterChange,
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
