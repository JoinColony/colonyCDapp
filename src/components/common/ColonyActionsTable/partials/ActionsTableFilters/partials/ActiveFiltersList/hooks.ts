import { useMemo } from 'react';

import { useFiltersContext } from '~common/ColonyActionsTable/FiltersContext/index.ts';
import { FiltersValues } from '~common/ColonyActionsTable/FiltersContext/types.ts';
import { getCustomDateLabel } from '~common/ColonyActionsTable/utils.ts';
import { formatText } from '~utils/intl.ts';

import { ACTION_TYPES_FILTERS } from '../filters/ActionTypeFilters/consts.ts';
import { DATE_FILTERS } from '../filters/DateFilters/consts.ts';
import { DECISION_METHOD_FILTERS } from '../filters/DecisionMethodFilters/consts.ts';
import { STATUS_FILTERS } from '../filters/StatusFilters/consts.ts';

export const useActiveFilters = () => {
  const {
    actionTypesFilters,
    dateFilters,
    decisionMethod,
    motionStates,
    handleResetFilters,
  } = useFiltersContext();

  const activeFiltersToDisplay = useMemo(() => {
    const customDate = getCustomDateLabel(dateFilters.custom);
    const restDateFilters = DATE_FILTERS.filter(
      ({ name }) => dateFilters[name],
    ).map(({ label }) => label);

    return [
      ...(actionTypesFilters.length
        ? [
            {
              filter: FiltersValues.ActionType,
              category: formatText({
                id: 'activityFeedTable.filters.actionType',
              }),
              items: ACTION_TYPES_FILTERS.filter(({ name }) =>
                actionTypesFilters.includes(name),
              ).map(({ label }) => label),
            },
          ]
        : []),
      ...(motionStates.length
        ? [
            {
              filter: FiltersValues.Status,
              category: formatText({
                id: 'activityFeedTable.filters.status',
              }),
              items: STATUS_FILTERS.filter(({ name }) =>
                motionStates.includes(name),
              ).map(({ label }) => label),
            },
          ]
        : []),
      ...(decisionMethod
        ? [
            {
              filter: FiltersValues.DecisionMethod,
              category: formatText({
                id: 'activityFeedTable.filters.decisionMethod',
              }),
              items: DECISION_METHOD_FILTERS.filter(
                ({ name }) => decisionMethod === name,
              ).map(({ label }) => label),
            },
          ]
        : []),
      ...(dateFilters.custom && customDate
        ? [
            {
              filter: FiltersValues.Custom,
              category: formatText({
                id: 'activityFeedTable.filters.date.custom',
              }),
              items: [customDate],
            },
          ]
        : []),
      ...(!dateFilters.custom && restDateFilters.length
        ? [
            {
              filter: FiltersValues.Date,
              category: formatText({
                id: 'activityFeedTable.filters.date',
              }),
              items: restDateFilters,
            },
          ]
        : []),
    ];
  }, [actionTypesFilters, dateFilters, decisionMethod, motionStates]);

  return { activeFiltersToDisplay, handleResetFilters };
};
