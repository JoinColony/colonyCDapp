import { Extension } from '@colony/colony-js';
import { useEffect, useMemo, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  SearchableColonyActionSortableFields,
  SearchableSortDirection,
  useSearchActionsQuery,
} from '~gql';
import useExtensionData from '~hooks/useExtensionData.ts';
import { notNull } from '~utils/arrays/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

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

  const { colonyAddress } = colony;

  const {
    extensionData: votingRepExtensionData,
    loading: loadingVotingRepExtension,
  } = useExtensionData(Extension.VotingReputation);

  const {
    extensionData: multiSigExtensionData,
    loading: loadingMultiSigExtension,
  } = useExtensionData(Extension.MultisigPermissions);

  const votingRepInstalledExtensionData = useMemo(() => {
    if (loadingVotingRepExtension) {
      return null;
    }

    return votingRepExtensionData &&
      isInstalledExtensionData(votingRepExtensionData)
      ? votingRepExtensionData
      : null;
  }, [loadingVotingRepExtension, votingRepExtensionData]);

  const multiSigInstalledExtensionData = useMemo(() => {
    if (loadingMultiSigExtension) {
      return null;
    }

    return multiSigExtensionData &&
      isInstalledExtensionData(multiSigExtensionData)
      ? multiSigExtensionData
      : null;
  }, [loadingMultiSigExtension, multiSigExtensionData]);

  const [pageNumber, setPageNumber] = useState(1);
  /**
   * Requested actions count is the total number of actions we want to fetch
   * It's set one page ahead to prefetch the next page actions
   */
  const requestedActionsCount = pageSize * (pageNumber + 1);

  useEffect(() => {
    setPageNumber(1);
  }, [filters]);

  const { data, fetchMore, loading } = useSearchActionsQuery({
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

  const actions = useMemo(
    () =>
      (items?.filter(notNull) ?? []).map(
        makeWithMotionStateMapper(
          motionStatesMap,
          votingRepInstalledExtensionData,
          multiSigInstalledExtensionData,
        ),
      ),
    [
      items,
      motionStatesMap,
      multiSigInstalledExtensionData,
      votingRepInstalledExtensionData,
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
    loadingMotionStates:
      loadingMultiSigExtension ||
      loadingVotingRepExtension ||
      motionStatesLoading,
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
