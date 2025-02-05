import React, {
  type FC,
  type PropsWithChildren,
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
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { type AnyActionType } from '~types/actions.ts';
import { type MotionState } from '~utils/colonyMotions.ts';
import { useChainOptions } from '~v5/common/ActionSidebar/partials/ChainSelect/hooks.ts';

import { type DateOptions } from '../partials/ActionsTableFilters/types.ts';
import { getDateFilter } from '../utils.ts';

import { FiltersContext, type FiltersContextValue } from './FiltersContext.ts';
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
  const [decisionMethods, setDecisionMethods] = useState<
    ActivityDecisionMethod[]
  >([]);
  const [actionTypesFilters, setActionTypesFilters] = useState<Action[]>([]);
  const [dateFilters, setDateFilters] = useState<DateOptions>(emptyDateFilters);
  const [chainIdFilters, setChainIdFilters] = useState<string[]>([]);

  const { dateFromCurrentBlockTime } = useCurrentBlockTime();
  const chainOptions = useChainOptions();

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

  const handleDecisionMethodsFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as ActivityDecisionMethod;

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

  const handleChainIdFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      const { name } = event.target;

      if (checked) {
        setChainIdFilters((state) => [...state, name]);
      } else {
        setChainIdFilters((state) =>
          state.filter((checkedItem) => checkedItem !== name),
        );
      }
    },
    [],
  );

  const activeFilters: ActivityFeedFilters = useMemo(() => {
    const date = dateFromCurrentBlockTime
      ? getDateFilter(dateFilters, dateFromCurrentBlockTime)
      : null;

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

    const chainIds = chainOptions
      .filter((chainOption) => chainIdFilters.includes(chainOption.label))
      .map((chainOption) => chainOption.value);

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
      ...(chainIdFilters.length ? { chainIds } : {}),
    };
  }, [
    dateFromCurrentBlockTime,
    dateFilters,
    actionTypesFilters,
    motionStates,
    decisionMethods,
    searchFilter,
    chainIdFilters,
    chainOptions,
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
        return setDateFilters(emptyDateFilters);
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

  const value = useMemo<FiltersContextValue>(
    () => ({
      searchFilter,
      setSearchFilter,
      motionStates,
      decisionMethods,
      actionTypesFilters,
      dateFilters,
      activeFilters,
      selectedFiltersCount,
      chainIdFilters,
      handleActionTypesFilterChange,
      handleDecisionMethodsFilterChange,
      handleMotionStatesFilterChange,
      handleDateFilterChange,
      handleCustomDateFilterChange,
      handleResetFilters,
      handleChainIdFilterChange,
    }),
    [
      searchFilter,
      motionStates,
      decisionMethods,
      actionTypesFilters,
      dateFilters,
      activeFilters,
      selectedFiltersCount,
      chainIdFilters,
      handleActionTypesFilterChange,
      handleDecisionMethodsFilterChange,
      handleMotionStatesFilterChange,
      handleDateFilterChange,
      handleCustomDateFilterChange,
      handleResetFilters,
      handleChainIdFilterChange,
    ],
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};

export default FiltersContextProvider;
