import { useMemo } from 'react';

import { useGetUserStakesQuery } from '~gql';
import {
  useAppContext,
  useColonyContext,
  useNetworkMotionStates,
} from '~hooks';
import { UserStakeWithStatus } from '~types';
import { notNull } from '~utils/arrays';

import { stakesFilterOptions } from './consts';
import { getStakeStatus } from './helpers';
import { StakesFilterType } from './types';

export const useStakesByFilterType = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { user } = useAppContext();
  const { walletAddress } = user ?? {};

  const {
    data,
    loading: stakesLoading,
    updateQuery,
  } = useGetUserStakesQuery({
    variables: {
      userAddress: walletAddress ?? '',
      colonyAddress,
    },
    skip: !walletAddress,
    fetchPolicy: 'cache-and-network',
  });
  const userStakes = useMemo(
    () => data?.getUserStakes?.items.filter(notNull) ?? [],
    [data],
  );

  const motionIds = useMemo(
    () =>
      userStakes
        .filter((stake) => !!stake.action?.motionData)
        .map((stake) => stake.action?.motionData?.motionId ?? ''),
    [userStakes],
  );
  const { motionStatesMap, loading: motionStatesLoading } =
    useNetworkMotionStates(motionIds);

  const stakesWithStatus = useMemo(
    () =>
      userStakes.map((stake) => ({
        ...stake,
        status: getStakeStatus(stake, motionStatesMap),
      })),
    [userStakes, motionStatesMap],
  );

  const stakesByFilterType = stakesFilterOptions.reduce((stakes, option) => {
    const updatedStakes = {
      ...stakes,
      [option.type]: stakesWithStatus.filter((stake) =>
        option.stakeStatuses.includes(stake.status),
      ),
    };

    return updatedStakes;
  }, {} as Record<StakesFilterType, UserStakeWithStatus[]>);

  const filtersDataLoading = stakesFilterOptions.reduce((loading, option) => {
    const isFilterDataLoading =
      stakesLoading || (option.requiresMotionState && motionStatesLoading);
    return {
      ...loading,
      [option.type]: isFilterDataLoading,
    };
  }, {} as Record<StakesFilterType, boolean>);

  /**
   * Function updating Apollo cache after some stakes have been claimed
   * We cannot simply refetch the query as it won't have the updated claimed status yet
   */
  const updateClaimedStakesCache = (claimedStakesIds: string[]) => {
    updateQuery((queryData) => ({
      ...queryData,
      getUserStakes: {
        ...queryData.getUserStakes,
        items:
          queryData.getUserStakes?.items.filter(notNull).map((stake) => {
            const isClaimed = claimedStakesIds.includes(stake.id);
            if (!isClaimed) {
              return stake;
            }
            return {
              ...stake,
              isClaimed: true,
            };
          }) ?? [],
      },
    }));
  };

  return { stakesByFilterType, filtersDataLoading, updateClaimedStakesCache };
};
