import { Extension } from '@colony/colony-js';
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
import useExtensionData from '~hooks/useExtensionData.ts';
import useNetworkMotionStates from '~hooks/useNetworkMotionStates.ts';
import { notNull } from '~utils/arrays/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import { useFiltersContext } from './FiltersContext/FiltersContext.ts';

export const useGetAgreements = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
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

  const { activeFilters, searchFilter } = useFiltersContext();
  const { data, loading } = useGetColonyActionsQuery({
    variables: {
      colonyAddress,
      filter: {
        type: { eq: ColonyActionType.CreateDecisionMotion },
      },
      sortDirection: ModelSortDirection.Desc,
    },
    fetchPolicy: 'network-only',
  });

  const agreementsData = data?.getActionsByColony?.items.filter(notNull);
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
        makeWithMotionStateMapper(
          motionStatesMap,
          votingRepInstalledExtensionData,
          multiSigInstalledExtensionData,
        ),
      ),
    [
      agreementsData,
      motionStatesMap,
      multiSigInstalledExtensionData,
      votingRepInstalledExtensionData,
    ],
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
