import { useMemo } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetUserStakesQuery } from '~gql';
import useNetworkMotionStatesAllColonies from '~hooks/useNetworkMotionStatesAllColonies.ts';
import { type UserStakeWithStatus } from '~types/userStake.ts';
import { notNull } from '~utils/arrays/index.ts';

import { stakesFilterOptions } from './consts.ts';
import { getStakeStatus } from './helpers.ts';
import { type StakesFilterType } from './types.ts';

export const useStakesByFilterType = () => {
  const { user } = useAppContext();
  const { walletAddress } = user ?? {};

  const {
    data,
    loading: stakesLoading,
    updateQuery,
  } = useGetUserStakesQuery({
    variables: {
      userAddress: walletAddress ?? '',
    },
    skip: !walletAddress,
    fetchPolicy: 'cache-and-network',
  });
  const userStakes = useMemo(
    () => data?.getUserStakes?.items.filter(notNull) ?? [],
    [data],
  );

  const userMotionStakes = useMemo(
    () =>
      userStakes
        .filter((stake) => !!stake.action?.motionData)
        .map((stake) => ({
          motionId: stake.action?.motionData?.motionId ?? '',
          colonyAddress: stake.action?.colonyAddress ?? '',
          databaseMotionId: stake.action?.motionData?.databaseMotionId ?? '',
        })),
    [userStakes],
  );

  const {
    motionStatesMap,
    loading: motionStatesLoading,
    votingReputationByColony,
  } = useNetworkMotionStatesAllColonies(userMotionStakes);

  const stakesWithStatus = useMemo(
    () =>
      userStakes.map((stake) => ({
        ...stake,
        status: getStakeStatus(
          stake,
          motionStatesMap,
          votingReputationByColony,
        ),
      })),
    [userStakes, motionStatesMap, votingReputationByColony],
  );

  const stakesByFilterType = stakesFilterOptions.reduce(
    (stakes, option) => {
      const updatedStakes = {
        ...stakes,
        [option.type]: stakesWithStatus.filter((stake) =>
          option.stakeStatuses.includes(stake.status),
        ),
      };

      return updatedStakes;
    },
    {} as Record<StakesFilterType, UserStakeWithStatus[]>,
  );

  const filtersDataLoading = stakesFilterOptions.reduce(
    (loading, option) => {
      const isFilterDataLoading = stakesLoading || motionStatesLoading;
      return {
        ...loading,
        [option.type]: isFilterDataLoading,
      };
    },
    {} as Record<StakesFilterType, boolean>,
  );

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

  return {
    stakesByFilterType,
    filtersDataLoading,
    updateClaimedStakesCache,
    votingReputationByColony,
  };
};
