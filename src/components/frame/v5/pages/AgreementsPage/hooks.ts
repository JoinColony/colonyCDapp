import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  useGetColonyActionsQuery,
  ColonyActionType,
  ModelSortDirection,
  useGetColonyActionQuery,
} from '~gql';
import {
  filterActionByMotionState,
  makeWithMotionStateMapper,
} from '~hooks/useActivityFeed/helpers.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import useNetworkMotionStates from '~hooks/useNetworkMotionStates.ts';
import { notNull } from '~utils/arrays/index.ts';
import { isTransactionFormat } from '~utils/web3/index.ts';

import { useFiltersContext } from './FiltersContext/FiltersContext.ts';

const QUERY_PAGE_SIZE = 20;

const useGetAllAgreements = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { data, loading, fetchMore, refetch } = useGetColonyActionsQuery({
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
    refetchAgreements: refetch,
  };
};

export const useGetCurrentOpenedAgreement = () => {
  const [searchParams] = useSearchParams();
  const transactionHash = searchParams.get('tx');
  const isInvalidTx = !isTransactionFormat(transactionHash ?? undefined);
  const { data: actionData } = useGetColonyActionQuery({
    skip: isInvalidTx,
    variables: {
      transactionHash: transactionHash ?? '',
    },
  });
  const action = actionData?.getColonyAction;
  const motionData = action?.motionData;

  return action?.type === ColonyActionType.CreateDecisionMotion
    ? motionData
    : null;
};

export const useGetAgreements = () => {
  const currentAgreement = useGetCurrentOpenedAgreement();
  const {
    loading: loadingExtensions,
    votingReputationExtensionData,
    multiSigExtensionData,
  } = useEnabledExtensions();

  const { activeFilters, searchFilter } = useFiltersContext();

  const { agreementsData, refetchAgreements, loading } = useGetAllAgreements();

  const selectedDomain = useGetSelectedDomainFilter();

  const motionIds = useMemo(
    () =>
      agreementsData
        ?.map((action) => action?.motionData?.motionId ?? '')
        .filter(Boolean) || [],
    [agreementsData],
  );

  useEffect(() => {
    if (
      !loading &&
      currentAgreement?.motionId &&
      !motionIds.includes(currentAgreement?.motionId)
    ) {
      refetchAgreements();
    }
  }, [currentAgreement?.motionId, motionIds, loading, refetchAgreements]);

  const {
    motionStatesMap,
    loading: motionStatesLoading,
    refetch: refetchMotionStates,
  } = useNetworkMotionStates(motionIds);
  const agreements = useMemo(
    () =>
      (agreementsData?.filter(notNull) ?? []).map(
        makeWithMotionStateMapper(
          motionStatesMap,
          votingReputationExtensionData,
          multiSigExtensionData,
        ),
      ),
    [
      agreementsData,
      motionStatesMap,
      multiSigExtensionData,
      votingReputationExtensionData,
    ],
  );

  const loadingMotionStateFilter =
    (motionStatesLoading || loadingExtensions) &&
    !!activeFilters?.motionStates?.length;

  const filteredAgreements = (
    selectedDomain
      ? agreements.filter(
          (agreement) =>
            Number(agreement.motionData?.nativeMotionDomainId) ===
            selectedDomain?.nativeId,
        )
      : agreements
  )
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
