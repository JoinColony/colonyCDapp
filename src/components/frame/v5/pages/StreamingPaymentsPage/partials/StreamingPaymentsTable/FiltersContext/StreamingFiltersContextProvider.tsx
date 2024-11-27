import React, {
  type FC,
  type PropsWithChildren,
  useState,
  useMemo,
  useCallback,
} from 'react';

import {
  type ModelSortDirection,
  type StreamingPaymentEndCondition,
} from '~gql';
import { type StreamingPaymentStatus } from '~types/streamingPayments.ts';

import { STATUS_FILTERS } from '../partials/StreamingPaymentFilters/partials/StatusFilters/consts.ts';
import {
  type StreamingPaymentFilters,
  type DateOptions,
} from '../partials/StreamingPaymentFilters/types.ts';
import { getDateFilter } from '../partials/StreamingPaymentFilters/utils.ts';

import { StreamingFiltersContext } from './StreamingFiltersContext.ts';
import { FiltersValues, type TokenTypes } from './types.ts';

const StreamingFiltersContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [statuses, setStatuses] = useState<StreamingPaymentStatus[]>([]);
  const [tokenTypes, setTokenTypes] = useState<TokenTypes>({});
  const [totalStreamedFilters, setTotalStreamedFilters] = useState<
    ModelSortDirection | undefined
  >(undefined);
  const [endConditions, setEndConditions] = useState<
    StreamingPaymentEndCondition[]
  >([]);
  const [dateFilters, setDateFilters] = useState<DateOptions>({
    pastHour: false,
    pastDay: false,
    pastWeek: false,
    pastMonth: false,
    pastYear: false,
    custom: undefined,
  });

  const handleStatusesFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as StreamingPaymentStatus;

      if (isChecked) {
        setStatuses([...statuses, name]);
      } else {
        setStatuses(statuses.filter((checkedItem) => checkedItem !== name));
      }
    },
    [statuses],
  );
  const handleEndConditionsFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as StreamingPaymentEndCondition;

      if (isChecked) {
        setEndConditions([...endConditions, name]);
      } else {
        setEndConditions(
          endConditions.filter((checkedItem) => checkedItem !== name),
        );
      }
    },
    [endConditions],
  );
  const handleTokenTypesFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as keyof TokenTypes;

      if (isChecked) {
        setTokenTypes({ ...tokenTypes, [name]: true });
      } else {
        setTokenTypes({ ...tokenTypes, [name]: false });
      }
    },
    [tokenTypes],
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
  const handleTotalStreamedFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const name = event.target.name as ModelSortDirection;

      if (isChecked) {
        setTotalStreamedFilters(name);
      } else {
        setTotalStreamedFilters(undefined);
      }
    },
    [],
  );

  const activeFilters: StreamingPaymentFilters = useMemo(() => {
    const date = getDateFilter(dateFilters);

    return {
      ...(statuses.length ? { statuses } : {}),
      ...(endConditions.length ? { endConditions } : {}),
      ...(totalStreamedFilters ? { totalStreamedFilters } : {}),
      ...(tokenTypes.length ? { endConditions } : {}),
      ...(searchFilter ? { search: searchFilter } : {}),
      ...(Object.keys(tokenTypes).length ? { tokenTypes } : {}),
      ...(date || {}),
    };
  }, [
    dateFilters,
    statuses,
    endConditions,
    tokenTypes,
    searchFilter,
    totalStreamedFilters,
  ]);

  const handleResetFilters = useCallback((filter: FiltersValues) => {
    switch (filter) {
      case FiltersValues.Status: {
        return setStatuses([]);
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
      case FiltersValues.EndCondition: {
        return setEndConditions([]);
      }
      case FiltersValues.TokenType: {
        return setTokenTypes({});
      }
      case FiltersValues.TotalStreamedFilters: {
        return setTotalStreamedFilters(undefined);
      }
      default: {
        return undefined;
      }
    }
  }, []);

  const statusCount = statuses.reduce((acc, current) => {
    if (STATUS_FILTERS[current]) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const selectedFiltersCount =
    statusCount + Object.values(dateFilters).filter(Boolean).length;

  const value = useMemo(
    () => ({
      searchFilter,
      setSearchFilter,
      dateFilters,
      statuses,
      endConditions,
      tokenTypes,
      activeFilters,
      totalStreamedFilters,
      selectedFiltersCount,
      handleStatusesFilterChange,
      handleResetFilters,
      handleDateFilterChange,
      handleCustomDateFilterChange,
      handleEndConditionsFilterChange,
      handleTokenTypesFilterChange,
      handleTotalStreamedFilterChange,
    }),
    [
      searchFilter,
      statuses,
      endConditions,
      dateFilters,
      tokenTypes,
      activeFilters,
      totalStreamedFilters,
      selectedFiltersCount,
      handleStatusesFilterChange,
      handleResetFilters,
      handleDateFilterChange,
      handleCustomDateFilterChange,
      handleEndConditionsFilterChange,
      handleTokenTypesFilterChange,
      handleTotalStreamedFilterChange,
    ],
  );

  return (
    <StreamingFiltersContext.Provider value={value}>
      {children}
    </StreamingFiltersContext.Provider>
  );
};

export default StreamingFiltersContextProvider;
