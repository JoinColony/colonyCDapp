import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  useGetColonyActionsQuery,
  ColonyActionType,
  ModelSortDirection,
} from '~gql';
import {
  filterActionByMotionState,
  makeWithMotionStateMapper,
} from '~hooks/useActivityFeed/helpers.ts';
import useNetworkMotionStates from '~hooks/useNetworkMotionStates.ts';
import { notNull } from '~utils/arrays/index.ts';

import { useFiltersContext } from './FiltersContext/FiltersContext.ts';

const QUERY_PAGE_SIZE = 20;

const useGetAllAgreements = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { data, loading, fetchMore } = useGetColonyActionsQuery({
    variables: {
      colonyAddress,
      filter: {
        type: { eq: ColonyActionType.CreateDecisionMotion },
      },
      sortDirection: ModelSortDirection.Desc,
      limit: QUERY_PAGE_SIZE,
    },
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      if (newData?.getActionsByColony?.nextToken) {
        fetchMore({
          variables: { nextToken: newData?.getActionsByColony?.nextToken },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            // Here, combine the previous items with the newly fetched items
            return {
              ...prev,
              getActionsByColony: {
                ...prev.getActionsByColony,
                items: [
                  ...(prev.getActionsByColony?.items ?? []),
                  ...(fetchMoreResult.getActionsByColony?.items ?? []),
                ],
                nextToken: fetchMoreResult?.getActionsByColony?.nextToken,
              },
            };
          },
        });
      }
    },
  });

  const agreementsData = data?.getActionsByColony?.items.filter(notNull);

  return {
    agreementsData,
    loading,
  };
};

export const useGetAgreements = () => {
  const { activeFilters, searchFilter } = useFiltersContext();

  const { agreementsData, loading } = useGetAllAgreements();

  const motionIds = useMemo(
    () =>
      agreementsData
        ?.map((action) => action?.motionData?.motionId ?? '')
        .filter(Boolean) || [],
    [agreementsData],
  );
  const {
    motionStatesMap,
    loading: motionStatesLoading,
    refetch: refetchMotionStates,
  } = useNetworkMotionStates(motionIds);
  const agreements = useMemo(
    () =>
      (agreementsData?.filter(notNull) ?? []).map(
        makeWithMotionStateMapper(motionStatesMap),
      ),
    [agreementsData, motionStatesMap],
  );

  const loadingMotionStateFilter =
    motionStatesLoading && !!activeFilters?.motionStates?.length;

  const filteredAgreements = agreements
    .filter((agreement) =>
      filterActionByMotionState(agreement, activeFilters?.motionStates),
    )
    .filter((agreement) => {
      if (activeFilters.dateFrom && activeFilters.dateTo) {
        const createdAtDate = new Date(
          agreement?.decisionData?.createdAt || '',
        );
        const dateFrom = new Date(activeFilters.dateFrom);
        const dateTo = new Date(activeFilters.dateTo);

        return createdAtDate >= dateFrom && createdAtDate <= dateTo;
      }
      return true;
    });
  const searchedAgreements = filteredAgreements.filter((agreement) =>
    agreement?.decisionData?.title
      ?.toLowerCase()
      .includes(searchFilter.toLowerCase()),
  );

  return {
    searchedAgreements,
    loadingMotionStateFilter,
    loading,
    refetchMotionStates,
  };
};
