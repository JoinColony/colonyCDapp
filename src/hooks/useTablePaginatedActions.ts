import { useState } from 'react';

import { type ActionData } from '~actions/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetColonyActionsQuery } from '~gql';
import { SortDirection } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';

const ITEMS_PER_PAGE = 10;

type SortDirectionChangeHandler = (newSortDirection: SortDirection) => void;

interface UseTablePaginatedActionsReturn {
  loading: boolean;
  sortDirection: SortDirection;
  onSortDirectionChange: SortDirectionChangeHandler;
  actions: ActionData[];
  hasMoreActions: boolean;
}

export const useTablePaginatedActions = (
  page: number,
  perPage = ITEMS_PER_PAGE,
): UseTablePaginatedActionsReturn => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Desc,
  );

  const { data, loading, fetchMore } = useGetColonyActionsQuery({
    variables: {
      colonyAddress,
      limit: perPage,
      sortDirection,
      filter: {
        // showInActionsList: { eq: true },
        // Don't show decisions in the actions list
        not: { colonyDecisionId: { beginsWith: '0x' } },
      },
    },
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
