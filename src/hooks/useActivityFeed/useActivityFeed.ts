import { useCallback, useEffect, useMemo, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useColonyTriggersContext } from '~context/GlobalTriggersContext/ColonyTriggersContext.ts';
import {
  SearchableColonyActionSortableFields,
  SearchableSortDirection,
  useOnCreateColonyActionMetadataSubscription,
  useOnUpdateColonyMotionSubscription,
  useSearchActionsQuery,
} from '~gql';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { notNull } from '~utils/arrays/index.ts';

import useNetworkMotionStates from '../useNetworkMotionStates.ts';

import {
  filterActionByMotionState,
  filterByActionTypes,
  filterBySearch,
  getActionsByPageNumber,
  getSearchActionsFilterVariable,
  makeWithMotionStateMapper,
} from './helpers.ts';
import {
  type ActivityFeedFilters,
  type ActivityFeedOptions,
  type ActivityFeedSort,
  type UseActivityFeedReturn,
} from './types.ts';

const ITEMS_PER_PAGE = 2;

const useActivityFeed = (
  filters?: ActivityFeedFilters,
  sort?: ActivityFeedSort,
  { pageSize = ITEMS_PER_PAGE }: ActivityFeedOptions = {},
): UseActivityFeedReturn => {
  const { colony } = useColonyContext();

  const { actionsTableTriggers, setActionsTableTriggers } =
    useColonyTriggersContext();

  const { colonyAddress } = colony;

  const {
    loading: loadingExtensions,
    votingReputationExtensionData,
    multiSigExtensionData,
  } = useEnabledExtensions();

  const [pageNumber, setPageNumber] = useState(1);
  /**
   * Requested actions count is the total number of actions we want to fetch
   * It's set one page ahead to prefetch the next page actions
   */
  const requestedActionsCount = pageSize * (pageNumber + 1);
  const stringifiedFilters = JSON.stringify(filters);

  useEffect(() => {
    setPageNumber(1);
  }, [stringifiedFilters]);

  const {
    data,
    fetchMore,
    loading,
    refetch: refetchActions,
  } = useSearchActionsQuery({
    variables: {
      filter: getSearchActionsFilterVariable(colonyAddress, filters),
      sort: sort || {
        field: SearchableColonyActionSortableFields.CreatedAt,
        direction: SearchableSortDirection.Desc,
      },
      limit: pageSize * 2,
    },
    fetchPolicy: 'network-only',
  });

  useOnCreateColonyActionMetadataSubscription({
    onData: () => {
      refetchActions();
    },
  });

  const { items, nextToken } = data?.searchColonyActions ?? {};

  const motionIds = useMemo(
    () =>
      items
        ?.map((action) => action?.motionData?.motionId ?? '')
        .filter(Boolean) || [],
    [items],
  );

  const {
    motionStatesMap,
    loading: motionStatesLoading,
    refetch: refetchMotionStates,
  } = useNetworkMotionStates(motionIds);

  const refreshActionStates = useCallback(async () => {
    await refetchActions();
    refetchMotionStates();
  }, [refetchActions, refetchMotionStates]);

  useOnUpdateColonyMotionSubscription({
    onData: refreshActionStates,
  });

  const { shouldRefetchMotionStates } = actionsTableTriggers;

  useEffect(() => {
    if (shouldRefetchMotionStates) {
      refreshActionStates();
      setActionsTableTriggers((triggers) => ({
        ...triggers,
        shouldRefetchMotionStates: false,
      }));
    }
  }, [shouldRefetchMotionStates, refreshActionStates, setActionsTableTriggers]);

  const actions = useMemo(
    () =>
      (items?.filter(notNull) ?? []).map(
        makeWithMotionStateMapper(
          motionStatesMap,
          votingReputationExtensionData,
          multiSigExtensionData,
        ),
      ),
    [
      items,
      motionStatesMap,
      multiSigExtensionData,
      votingReputationExtensionData,
    ],
  );

  const loadingMotionStateFilter =
    motionStatesLoading && !!filters?.motionStates?.length;

  const filteredActions = actions.filter(
    (action) =>
      filterActionByMotionState(action, filters?.motionStates) &&
      filterBySearch(action, colony, filters?.search) &&
      filterByActionTypes(action, colony, filters?.actionTypes),
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

  const hasNextPage =
    pageNumber * pageSize < filteredActions.length ||
    fetchMoreActions ||
    loadingMotionStateFilter;
  const hasPrevPage = pageNumber > 1;

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
    pageSize,
  );

  const nextPageActions = getActionsByPageNumber(
    filteredActions,
    pageNumber + 1,
    pageSize,
  );

  const loadingFirstPage =
    (loading || fetchMoreActions || loadingMotionStateFilter) &&
    visibleActions.length < pageSize;
  const loadingNextPage =
    (loading || fetchMoreActions || loadingMotionStateFilter) &&
    nextPageActions.length < pageSize;

  return {
    loadingFirstPage,
    loadingNextPage,
    loadingMotionStates: loadingExtensions || motionStatesLoading,
    actions: visibleActions,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPreviousPage,
    pageNumber,
    refetchMotionStates,
  };
};

export default useActivityFeed;
