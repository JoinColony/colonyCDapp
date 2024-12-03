import { useMemo } from 'react';

import { useStreamingFiltersContext } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/FiltersContext/StreamingFiltersContext.ts';
import { FiltersValues } from '~frame/v5/pages/StreamingPaymentsPage/partials/StreamingPaymentsTable/FiltersContext/types.ts';
import { formatText } from '~utils/intl.ts';

import { DATE_FILTERS } from '../StreamingPaymentFilters/partials/DateFilters/consts.ts';
import { END_CONDITION_FILTERS } from '../StreamingPaymentFilters/partials/EndConditionFilters/consts.ts';
import { STATUS_FILTERS } from '../StreamingPaymentFilters/partials/StatusFilters/consts.ts';
import { useGetTokenTypeFilters } from '../StreamingPaymentFilters/partials/TokenFilters/hooks.ts';
import { TOTAL_STREAMED_FILTERS } from '../StreamingPaymentFilters/partials/TotalStreamedFilters/consts.ts';
import { getCustomDateLabel } from '../StreamingPaymentFilters/utils.ts';

export const useActiveFilters = () => {
  const {
    statuses,
    handleResetFilters,
    dateFilters,
    endConditions,
    tokenTypes,
    totalStreamedFilters,
  } = useStreamingFiltersContext();

  const tokenTypesFilters = useGetTokenTypeFilters();
  const tokenItems = tokenTypesFilters.map(({ token }) => ({
    symbol: token.symbol,
    name: token?.tokenAddress || '',
  }));

  const activeFiltersToDisplay = useMemo(() => {
    const customDate = getCustomDateLabel(dateFilters.custom);
    const restDateFilters = DATE_FILTERS.filter(
      ({ name }) => dateFilters[name],
    ).map(({ label }) => label);

    return [
      ...(statuses.length
        ? [
            {
              filter: FiltersValues.Status,
              label: formatText({
                id: 'streamingPayment.table.filter.status',
              }),
              items: STATUS_FILTERS.filter(({ name }) =>
                statuses.includes(name),
              ).map(({ label }) => label),
            },
          ]
        : []),
      ...(endConditions.length
        ? [
            {
              filter: FiltersValues.EndCondition,
              label: formatText({
                id: 'streamingPayment.table.filter.endCondition',
              }),
              items: END_CONDITION_FILTERS.filter(({ name }) =>
                endConditions.includes(name),
              ).map(({ label }) => label),
            },
          ]
        : []),
      ...(totalStreamedFilters && totalStreamedFilters.length
        ? [
            {
              filter: FiltersValues.TotalStreamedFilters,
              label: formatText({
                id: 'streamingPayment.table.filter.totalStreamed',
              }),
              items: TOTAL_STREAMED_FILTERS.filter(({ name }) =>
                totalStreamedFilters.includes(name),
              ).map(({ label }) => label),
            },
          ]
        : []),
      ...(Object.values(tokenTypes).some((value) => value === true)
        ? [
            {
              filter: FiltersValues.TokenType,
              label: formatText({
                id: 'streamingPayment.table.filter.tokenType',
              }),
              items: tokenItems
                .filter(({ name }) => tokenTypes[name])
                .map(({ symbol }) => symbol),
            },
          ]
        : []),
      ...(dateFilters.custom && customDate
        ? [
            {
              filter: FiltersValues.Custom,
              label: formatText({
                id: 'streamingPayment.table.filter.date.custom',
              }),
              items: [customDate],
            },
          ]
        : []),
      ...(restDateFilters.length
        ? [
            {
              filter: FiltersValues.Date,
              label: formatText({
                id: 'streamingPayment.table.filter.date',
              }),
              items: restDateFilters,
            },
          ]
        : []),
    ];
  }, [
    dateFilters,
    endConditions,
    statuses,
    tokenItems,
    tokenTypes,
    totalStreamedFilters,
  ]);

  return { activeFiltersToDisplay, handleResetFilters };
};
