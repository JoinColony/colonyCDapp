import { useMemo } from 'react';

import { useFiltersContext } from '~frame/v5/pages/BalancePage/partials/BalanceTable/Filters/FiltersContext/index.ts';
import { FiltersValues } from '~frame/v5/pages/BalancePage/partials/BalanceTable/Filters/FiltersContext/types.ts';
import { formatText } from '~utils/intl.ts';

import { ATTRIBUTE_FILTERS } from '../filters/AttributeFilters/consts.ts';
import { useGetTokenTypeFilters } from '../filters/TokenFilters/hooks.ts';

// The hook used to show enabled filters via the blue filter pills
export const useActiveFilters = () => {
  const {
    handleResetFilters,
    filters: { attribute, token, chain },
  } = useFiltersContext();

  const tokenTypesFilters = useGetTokenTypeFilters();
  const tokenItems = tokenTypesFilters.map(({ token: tokenTypeFilter }) => ({
    symbol: tokenTypeFilter.symbol,
    name: tokenTypeFilter?.tokenAddress || '',
  }));

  const activeFiltersToDisplay = useMemo(() => {
    return [
      ...(Object.values(token).some((value) => value === true)
        ? [
            {
              filter: FiltersValues.TokenType,
              category: formatText({
                id: 'balancePage.filter.type',
              }),
              items: tokenItems
                .filter(({ name }) => token[name])
                .map(({ symbol }) => symbol),
            },
          ]
        : []),
      ...(Object.values(attribute).some((value) => value === true)
        ? [
            {
              filter: FiltersValues.Attributes,
              category: formatText({
                id: 'balancePage.filter.attributes',
              }),
              items: ATTRIBUTE_FILTERS.filter(
                ({ name }) => attribute[name],
              ).map(({ label }) => label),
            },
          ]
        : []),
      ...(Object.values(chain).some((value) => value === true)
        ? [
            {
              filter: FiltersValues.Chain,
              category: formatText({
                id: 'balancePage.filter.chain',
              }),
              items: Object.keys(chain),
            },
          ]
        : []),
    ];
  }, [token, tokenItems, attribute, chain]);

  return { activeFiltersToDisplay, handleResetFilters };
};
