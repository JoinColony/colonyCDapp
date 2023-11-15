import { useEffect, useMemo, useState } from 'react';

import {
  SearchableColonyActionSortableFields,
  SearchableSortDirection,
  useSearchActionsQuery,
} from '~gql';
import { ColonyAction, ColonyActionType } from '~types';
import { notNull } from '~utils/arrays';
import { useNetworkMotionStates } from '~hooks';
import { MotionState } from '~utils/colonyMotions';

import useColonyContext from '../useColonyContext';
import { filterActionByActionType, filterActionByMotionState } from './helpers';

interface ActivityFeedFilters {
  actionTypes?: ColonyActionType[];
  motionStates?: MotionState[];
}

interface UseActivityFeedReturn {
  loading: boolean;
  actions: ColonyAction[];
  sortDirection: SearchableSortDirection;
  changeSortDirection: SortDirectionChangeHandler;
  hasMoreActions: boolean;
  loadMoreActions: () => void;
  isFetchingMore: boolean;
}

type SortDirectionChangeHandler = (
  newSortDirection: SearchableSortDirection,
) => void;

const ITEMS_PER_PAGE = 1;

const useActivityFeed = (
  filters?: ActivityFeedFilters,
): UseActivityFeedReturn => {
  const { colony } = useColonyContext();

  const [sortDirection, setSortDirection] = useState<SearchableSortDirection>(
    SearchableSortDirection.Desc,
  );
  const [visibleActionsCount, setVisibleActionsCount] =
    useState(ITEMS_PER_PAGE);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { data, fetchMore, loading } = useSearchActionsQuery({
    variables: {
      filter: {
        colonyId: {
          eq: colony?.colonyAddress ?? '',
        },
        showInActionsList: {
          eq: true,
        },
        colonyDecisionId: {
          exists: false,
        },
      },
      sort: [
        {
          field: SearchableColonyActionSortableFields.CreatedAt,
          direction: sortDirection,
        },
      ],
      limit: ITEMS_PER_PAGE,
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
  const { motionStatesMap } = useNetworkMotionStates(motionIds);

  const filteredActions = actions
    .filter((action) => filterActionByActionType(action, filters?.actionTypes))
    .filter((action) =>
      filterActionByMotionState(action, motionStatesMap, filters?.motionStates),
    );

  const hasMoreActions =
    visibleActionsCount < filteredActions.length || !!nextToken;
  const fetchMoreActions =
    nextToken && filteredActions.length < visibleActionsCount;
  useEffect(() => {
    if (fetchMoreActions) {
      setIsFetchingMore(true);
      fetchMore({ variables: { nextToken } });
    } else {
      setIsFetchingMore(false);
    }
  }, [fetchMore, fetchMoreActions, nextToken]);

  const changeSortDirection: SortDirectionChangeHandler = (
    newSortDirection,
  ) => {
    setSortDirection(newSortDirection);
  };

  const loadMoreActions = () => {
    setVisibleActionsCount((count) => count + ITEMS_PER_PAGE);
  };

  const visibleActions = filteredActions.slice(0, visibleActionsCount);

  return {
    loading,
    actions: visibleActions,
    sortDirection,
    changeSortDirection,
    hasMoreActions,
    loadMoreActions,
    isFetchingMore,
  };
};

export default useActivityFeed;
