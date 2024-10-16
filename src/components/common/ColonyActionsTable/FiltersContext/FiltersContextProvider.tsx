import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { type CoreAction } from '~actions';
import { ACTION_TYPE_TO_API_ACTION_TYPES_MAP } from '~constants/actionsFilters.ts';
import { type DecisionMethod } from '~gql';
import { type ActivityFeedFilters } from '~hooks/useActivityFeed/types.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { type MotionState } from '~utils/colonyMotions.ts';

import { type DateOptions } from '../partials/ActionsTableFilters/types.ts';
import { getDateFilter } from '../utils.ts';

import { FiltersContext } from './FiltersContext.ts';
import { FiltersValues } from './types.ts';

const FiltersContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [motionStates, setMotionStates] = useState<MotionState[]>([]);
  const [decisionMethods, setDecisionMethods] = useState<DecisionMethod[]>([]);
  const [actionTypesFilters, setActionTypesFilters] = useState<CoreAction[]>(
    [],
  );
  const [dateFilters, setDateFilters] = useState<DateOptions>({
    pastHour: false,
    pastDay: false,
    pastWeek: false,
    pastMonth: false,
    pastYear: false,
    custom: undefined,
  });
  const { dateFromCurrentBlockTime } = useCurrentBlockTime();

  const handleActionTypesFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as CoreAction;

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

  const handleDecisionMethodsFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as DecisionMethod;

      if (isChecked) {
        setDecisionMethods((prevValues) => [...prevValues, name]);
      } else {
        setDecisionMethods((prevValues) =>
          prevValues.filter((checkedItem) => checkedItem !== name),
        );
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
    const date = dateFromCurrentBlockTime
      ? getDateFilter(dateFilters, dateFromCurrentBlockTime)
      : null;
    const actionTypes = actionTypesFilters.reduce<CoreAction[]>(
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
      ...(decisionMethods.length
        ? {
            decisionMethods,
          }
        : {}),
      ...(searchFilter ? { search: searchFilter } : {}),
    };
  }, [
    actionTypesFilters,
    dateFromCurrentBlockTime,
    dateFilters,
    decisionMethods,
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
        return setDecisionMethods([]);
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
    decisionMethods.length +
    Object.values(dateFilters).filter(Boolean).length;

  const value = useMemo(
    () => ({
      searchFilter,
      setSearchFilter,
      motionStates,
      decisionMethods,
      actionTypesFilters,
      dateFilters,
      activeFilters,
      selectedFiltersCount,
      handleActionTypesFilterChange,
      handleDecisionMethodsFilterChange,
      handleMotionStatesFilterChange,
      handleDateFilterChange,
      handleCustomDateFilterChange,
      handleResetFilters,
    }),
    [
      searchFilter,
      motionStates,
      decisionMethods,
      actionTypesFilters,
      dateFilters,
      activeFilters,
      selectedFiltersCount,
      handleActionTypesFilterChange,
      handleDecisionMethodsFilterChange,
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

export default FiltersContextProvider;
