import { useMemo } from 'react';

import { formatText } from '~utils/intl.ts';

import { useFiltersContext } from '../../FilterContext/index.ts';
import { FiltersValues } from '../../FilterContext/types.ts';
import { ATTRIBUTE_FILTERS } from '../filters/AttributeFilters/consts.ts';
import { useGetTokenTypeFilters } from '../filters/TokenFilters/consts.tsx';

export const useActiveFilters = () => {
  const { attributeFilters, tokenTypes, handleResetFilters } =
    useFiltersContext();

  const tokenTypesFilters = useGetTokenTypeFilters();

  const activeFiltersToDisplay = useMemo(() => {
    return [
      ...(Object.values(tokenTypes).some((value) => value === true)
        ? [
            {
              filter: FiltersValues.TokenType,
              category: formatText({
                id: 'balancePage.filter.type',
              }),
              items: tokenTypesFilters
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
  }, [attributeFilters, tokenTypes, tokenTypesFilters]);

  return { activeFiltersToDisplay, handleResetFilters };
};
