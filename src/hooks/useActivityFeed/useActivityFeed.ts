import { useEffect, useMemo, useState } from 'react';

import {
  SearchableColonyActionSortableFields,
  SearchableSortDirection,
  useSearchActionsQuery,
} from '~gql';
import { notNull } from '~utils/arrays';
import { useNetworkMotionStates } from '~hooks';

import useColonyContext from '../useColonyContext';
import {
  filterActionByMotionState,
  getActionsByPageNumber,
  getSearchActionsFilterVariable,
} from './helpers';
import {
  ActivityFeedFilters,
  SortDirectionChangeHandler,
  UseActivityFeedReturn,
} from './types';

const ITEMS_PER_PAGE = 2;

const useActivityFeed = (
  filters?: ActivityFeedFilters,
): UseActivityFeedReturn => {
  const { colony } = useColonyContext();

  const [sortDirection, setSortDirection] = useState<SearchableSortDirection>(
    SearchableSortDirection.Desc,
  );
  const [pageNumber, setPageNumber] = useState(1);
  /**
   * Requested actions count is the total number of actions we want to fetch
   * It's set one page ahead to prefetch the next page actions
   */
  const requestedActionsCount = ITEMS_PER_PAGE * (pageNumber + 1);

  useEffect(() => {
    setPageNumber(1);
  }, [filters]);

  const { data, fetchMore, loading } = useSearchActionsQuery({
    variables: {
      filter: getSearchActionsFilterVariable(
        colony?.colonyAddress ?? '',
        filters,
      ),
      sort: [
        {
          field: SearchableColonyActionSortableFields.CreatedAt,
          direction: sortDirection,
        },
      ],
      limit: ITEMS_PER_PAGE * 2,
    },
    fetchPolicy: 'network-only',
    skip: !colony,
  });

  const { items, nextToken } = data?.searchColonyActions ?? {};
  const actions = useMemo(() => items?.filter(notNull) ?? [], [items]);

  const motionIds = useMemo(
    () =>
      actions
        .map((action) => action.motionData?.motionId ?? '')
        .filter(Boolean),
    [actions],
  );
  const { motionStatesMap, loading: motionStatesLoading } =
    useNetworkMotionStates(motionIds, !filters?.motionStates?.length);
  const loadingMotionStateFilter =
    motionStatesLoading && !!filters?.motionStates?.length;

  const filteredActions = actions.filter((action) =>
    filterActionByMotionState(action, motionStatesMap, filters?.motionStates),
  );

  const fetchMoreActions =
    !!nextToken &&
    filteredActions.length < requestedActionsCount &&
    !loadingMotionStateFilter;
  useEffect(() => {
    if (fetchMoreActions) {
      fetchMore({ variables: { nextToken } });
    }
  }, [fetchMore, fetchMoreActions, nextToken]);

  const changeSortDirection: SortDirectionChangeHandler = (
    newSortDirection,
  ) => {
    setSortDirection(newSortDirection);
  };

  const hasNextPage =
    pageNumber * ITEMS_PER_PAGE < filteredActions.length ||
    fetchMoreActions ||
    loadingMotionStateFilter;

  const goToNextPage = () => {
    if (loading || fetchMoreActions || loadingMotionStateFilter) {
      return;
    }
    setPageNumber((number) => number + 1);
  };

  const goToPreviousPage = () => {
    if (pageNumber === 1) {
      return;
    }
    setPageNumber((number) => number - 1);
  };

  const visibleActions = getActionsByPageNumber(
    filteredActions,
    pageNumber,
    ITEMS_PER_PAGE,
  );
  const nextPageActions = getActionsByPageNumber(
    filteredActions,
    pageNumber + 1,
    ITEMS_PER_PAGE,
  );

  const loadingFirstPage =
    (loading || fetchMoreActions || loadingMotionStateFilter) &&
    visibleActions.length < ITEMS_PER_PAGE;
  const loadingNextPage =
    (loading || fetchMoreActions || loadingMotionStateFilter) &&
    nextPageActions.length < ITEMS_PER_PAGE;

  return {
    loadingFirstPage,
    loadingNextPage,
    actions: visibleActions,
    sortDirection,
    changeSortDirection,
    hasNextPage,
    goToNextPage,
    goToPreviousPage,
    pageNumber,
  };
};

export default useActivityFeed;
