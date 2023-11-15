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
import {
  filterActionByActionType,
  filterActionByMotionState,
  getActionsByPageNumber,
} from './helpers';

interface ActivityFeedFilters {
  actionTypes?: ColonyActionType[];
  motionStates?: MotionState[];
}

interface UseActivityFeedReturn {
  loading: boolean;
  actions: ColonyAction[];
  sortDirection: SearchableSortDirection;
  changeSortDirection: SortDirectionChangeHandler;
  hasNextPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  pageNumber: number;
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
  const [pageNumber, setPageNumber] = useState(1);
  const requestedActionsCount = ITEMS_PER_PAGE * pageNumber;

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

  const fetchMoreActions =
    !!nextToken && filteredActions.length < requestedActionsCount;
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
    requestedActionsCount < filteredActions.length || !!nextToken;

  const goToNextPage = () => {
    if (!hasNextPage) {
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

  const isNextPageLoading = pageNumber > 1 && fetchMoreActions;
  const resolvedPageNumber = isNextPageLoading ? pageNumber - 1 : pageNumber;
  const currentPageActions = getActionsByPageNumber(
    filteredActions,
    resolvedPageNumber,
    ITEMS_PER_PAGE,
  );

  if (!currentPageActions.length && pageNumber > 1) {
    setPageNumber((number) => number - 1);
  }

  return {
    loading: loading || fetchMoreActions,
    actions: currentPageActions,
    sortDirection,
    changeSortDirection,
    hasNextPage,
    goToNextPage,
    goToPreviousPage,
    pageNumber: resolvedPageNumber,
  };
};

export default useActivityFeed;
