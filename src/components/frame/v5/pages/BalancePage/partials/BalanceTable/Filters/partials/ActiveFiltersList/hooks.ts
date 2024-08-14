import { useMemo } from 'react';

import { useFiltersContext } from '~frame/v5/pages/BalancePage/partials/BalanceTable/Filters/FiltersContext/index.ts';
import { FiltersValues } from '~frame/v5/pages/BalancePage/partials/BalanceTable/Filters/FiltersContext/types.ts';
import { formatText } from '~utils/intl.ts';

import { ATTRIBUTE_FILTERS } from '../filters/AttributeFilters/consts.ts';
import { useGetTokenTypeFilters } from '../filters/TokenFilters/hooks.ts';

export const useActiveFilters = () => {
  const { attributeFilters, tokenTypes, handleResetFilters } =
    useFiltersContext();

  const tokenTypesFilters = useGetTokenTypeFilters();
  const tokenItems = tokenTypesFilters.map(({ token }) => ({
    symbol: token.symbol,
    name: token?.tokenAddress || '',
  }));

  const activeFiltersToDisplay = useMemo(() => {
    return [
      ...(Object.values(tokenTypes).some((value) => value === true)
        ? [
            {
              filter: FiltersValues.TokenType,
              category: formatText({
                id: 'balancePage.filter.type',
              }),
              items: tokenItems
                .filter(({ name }) => tokenTypes[name])
                .map(({ symbol }) => symbol),
            },
          ]
        : []),
      ...(Object.values(attributeFilters).some((value) => value === true)
        ? [
            {
              filter: FiltersValues.Attributes,
              category: formatText({
                id: 'balancePage.filter.attributes',
              }),
              items: ATTRIBUTE_FILTERS.filter(
                ({ name }) => attributeFilters[name],
              ).map(({ label }) => label),
            },
          ]
        : []),
    ];
  }, [attributeFilters, tokenTypes, tokenItems]);

  return { activeFiltersToDisplay, handleResetFilters };
};
