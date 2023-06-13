import { useState } from 'react';

import { useGetColonyActionsQuery } from '~gql';
import { ColonyAction, SortDirection } from '~types';
import { notNull } from '~utils/arrays';

import useColonyContext from './useColonyContext';

const ITEMS_PER_PAGE = 10;

type SortDirectionChangeHandler = (newSortDirection: SortDirection) => void;

interface UsePaginatedActionsReturn {
  loading: boolean;
  sortDirection: SortDirection;
  onSortDirectionChange: SortDirectionChangeHandler;
  actions: ColonyAction[];
  hasMoreActions: boolean;
  loadMoreActions: () => void;
}

export const usePaginatedActions = (): UsePaginatedActionsReturn => {
  const { colony } = useColonyContext();

  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Desc,
  );

  const { data, loading, fetchMore } = useGetColonyActionsQuery({
    variables: {
      colonyAddress: colony?.colonyAddress ?? '',
      limit: ITEMS_PER_PAGE,
      sortDirection,
      filter: { showInActionsList: { eq: true } },
    },
    skip: !colony,
    fetchPolicy: 'network-only',
  });
  const { items, nextToken } = data?.getActionsByColony || {};
  const [visibleActionsCount, setVisibleActionsCount] =
    useState(ITEMS_PER_PAGE);

  const actions = items?.filter(notNull) || [];
  const hasMoreActions = visibleActionsCount < actions.length || !!nextToken;

  const handleSortDirectionChange: SortDirectionChangeHandler = (
    newSortDirection,
  ) => {
    setSortDirection(newSortDirection);
  };

  const fetchMoreActions = nextToken && actions.length < visibleActionsCount;
  if (fetchMoreActions) {
    fetchMore({
      variables: {
        nextToken,
      },
    });
  }

  const loadMoreActions = () => {
    setVisibleActionsCount((count) => count + ITEMS_PER_PAGE);
  };

  return {
    loading,
    sortDirection,
    onSortDirectionChange: handleSortDirectionChange,
    actions: actions.slice(0, visibleActionsCount),
    hasMoreActions,
    loadMoreActions,
  };
};

export default usePaginatedActions;
