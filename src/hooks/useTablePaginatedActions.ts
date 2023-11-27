import { useState } from 'react';

import { useGetColonyActionsQuery } from '~gql';
import { ColonyAction, SortDirection } from '~types';
import { notNull } from '~utils/arrays';

import useColonyContext from './useColonyContext';

const ITEMS_PER_PAGE = 10;

type SortDirectionChangeHandler = (newSortDirection: SortDirection) => void;

interface UseTablePaginatedActionsReturn {
  loading: boolean;
  sortDirection: SortDirection;
  onSortDirectionChange: SortDirectionChangeHandler;
  actions: ColonyAction[];
  hasMoreActions: boolean;
}

export const useTablePaginatedActions = (
  page: number,
  perPage = ITEMS_PER_PAGE,
): UseTablePaginatedActionsReturn => {
  const { colony } = useColonyContext();

  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Desc,
  );

  const { data, loading, fetchMore } = useGetColonyActionsQuery({
    variables: {
      colonyAddress: colony?.colonyAddress ?? '',
      limit: perPage,
      sortDirection,
      filter: {
        // showInActionsList: { eq: true },
        // Don't show decisions in the actions list
        not: { colonyDecisionId: { beginsWith: '0x' } },
      },
    },
    skip: !colony,
    fetchPolicy: 'network-only',
  });
  const { items, nextToken } = data?.getActionsByColony || {};
  const actionsToFetchCount = page * perPage;

  const actions = items?.filter(notNull) || [];
  const hasMoreActions = actionsToFetchCount < actions.length || !!nextToken;

  const handleSortDirectionChange: SortDirectionChangeHandler = (
    newSortDirection,
  ) => {
    setSortDirection(newSortDirection);
  };

  const fetchMoreActions = nextToken && actions.length < actionsToFetchCount;

  if (fetchMoreActions) {
    fetchMore({
      variables: {
        nextToken,
      },
    });
  }

  return {
    loading,
    sortDirection,
    onSortDirectionChange: handleSortDirectionChange,
    actions: actions.slice((page - 1) * perPage, page * perPage),
    hasMoreActions,
  };
};

export default useTablePaginatedActions;
