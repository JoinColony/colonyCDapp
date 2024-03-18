import { type SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import {
  type SearchableColonyActionSortInput,
  SearchableColonyActionSortableFields,
  SearchableSortDirection,
} from '~gql';
import useActivityFeed from '~hooks/useActivityFeed/index.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';

import { useFiltersContext } from '../FiltersContext/FiltersContext.ts';
import { makeLoadingRows } from '../utils.ts';

const useActionsTableData = (pageSize: number) => {
  const selectedDomain = useGetSelectedDomainFilter();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ]);
  const { activeFilters } = useFiltersContext();
  const {
    actions,
    pageNumber,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPreviousPage,
    loadingFirstPage,
    loadingNextPage,
    loadingMotionStates,
    refetchMotionStates,
  } = useActivityFeed(
    useMemo(
      () => ({
        ...activeFilters,
        teamId: selectedDomain?.id || undefined,
      }),
      [activeFilters, selectedDomain?.id],
    ),
    useMemo(() => {
      const validSortValues = sorting?.reduce<
        SearchableColonyActionSortInput[]
      >((result, { desc, id }) => {
        try {
          const sortColumn = getEnumValueFromKey(
            SearchableColonyActionSortableFields,
            id,
          );

          return [
            ...result,
            {
              field: sortColumn,
              direction: desc
                ? SearchableSortDirection.Desc
                : SearchableSortDirection.Asc,
            },
          ];
        } catch {
          return result;
        }
      }, []);

      if (!validSortValues || !validSortValues.length) {
        return undefined;
      }

      return validSortValues;
    }, [sorting]),
    {
      pageSize,
    },
  );
  const loading = loadingFirstPage || loadingNextPage;

  return {
    pageNumber,
    refetchMotionStates,
    loadingMotionStates,
    data: loading ? makeLoadingRows(pageSize) : actions,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPreviousPage,
    loading,
    sorting,
    setSorting,
  };
};

export default useActionsTableData;
