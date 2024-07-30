import { useMemo } from 'react';

import { useFiltersContext } from '~frame/v5/pages/AgreementsPage/FiltersContext/index.ts';
import { FiltersValues } from '~frame/v5/pages/AgreementsPage/FiltersContext/types.ts';
import { formatText } from '~utils/intl.ts';

import { DATE_FILTERS } from '../AgreementsPageFilters/partials/DateFilters/consts.ts';
import { STATUS_FILTERS } from '../AgreementsPageFilters/partials/StatusFilters/consts.ts';
import { getCustomDateLabel } from '../AgreementsPageFilters/utils.ts';

export const useActiveFilters = () => {
  const { motionStates, handleResetFilters, dateFilters } = useFiltersContext();

  const activeFiltersToDisplay = useMemo(() => {
    const customDate = getCustomDateLabel(dateFilters.custom);
    const restDateFilters = DATE_FILTERS.filter(
      ({ name }) => dateFilters[name],
    ).map(({ label }) => label);

    return [
      ...(motionStates.length
        ? [
            {
              filter: FiltersValues.Status,
              label: formatText({
                id: 'agreementsPage.filter.status',
              }),
              items: STATUS_FILTERS.filter(({ name }) =>
                motionStates.includes(name),
              ).map(({ label }) => label),
            },
          ]
        : []),
      ...(dateFilters.custom && customDate
        ? [
            {
              filter: FiltersValues.Custom,
              label: formatText({
                id: 'agreementsPage.filter.date.custom',
              }),
              items: [customDate],
            },
          ]
        : []),
      ...(!dateFilters.custom && restDateFilters.length
        ? [
            {
              filter: FiltersValues.Date,
              label: formatText({
                id: 'agreementsPage.filter.date',
              }),
              items: restDateFilters,
            },
          ]
        : []),
    ];
  }, [dateFilters, motionStates]);

  return { activeFiltersToDisplay, handleResetFilters };
};
