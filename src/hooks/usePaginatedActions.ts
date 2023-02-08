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
    },
    skip: !colony,
    fetchPolicy: 'network-only',
  });
  const { items, nextToken } = data?.getActionsByColony || {};
  const actions = items?.filter(notNull) || [];
  const hasMoreActions = !!nextToken;

  const handleSortDirectionChange: SortDirectionChangeHandler = (
    newSortDirection,
  ) => {
    setSortDirection(newSortDirection);
  };

  const loadMoreActions = () => {
    fetchMore({
      variables: {
        nextToken,
      },
    });
  };

  return {
    loading,
    sortDirection,
    onSortDirectionChange: handleSortDirectionChange,
    actions,
    hasMoreActions,
    loadMoreActions,
  };
};

export default usePaginatedActions;
