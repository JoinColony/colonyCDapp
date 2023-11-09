import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useGetUserStakesQuery } from '~gql';
import { useAppContext, useColonyContext } from '~hooks';
import { useNetworkMotionStates } from '~hooks/useNetworkMotionStates';
import { notNull } from '~utils/arrays';
import Numeral from '~shared/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { StakesTabContentListItem } from './partials/StakesTabContentList/types';
import { getStakeStatus } from './helpers';
import { stakesFilterOptions } from './consts';
import { StakesFilterType, UseStakesByFilterTypeReturnType } from './types';

export const useStakesByFilterType = (): UseStakesByFilterTypeReturnType => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const intl = useIntl();
  const { walletAddress } = user ?? {};

  const {
    data,
    loading: stakesLoading,
    updateQuery,
  } = useGetUserStakesQuery({
    variables: {
      userAddress: walletAddress ?? '',
      colonyAddress: colony?.colonyAddress ?? '',
    },
    skip: !walletAddress || !colony?.colonyAddress,
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
        .map((stake) => stake.action?.motionData?.nativeMotionId ?? ''),
    [userStakes],
  );
  const { motionStatesMap, loading: motionStatesLoading } =
    useNetworkMotionStates(motionIds);

  const { nativeToken } = colony || {};

  const stakesWithStatus: StakesTabContentListItem[] = useMemo(
    () =>
      userStakes.map((stake) => ({
        key: stake.id,
        // @TODO: Replace with action custom title
        title: stake.action?.type || '',
        date: intl.formatDate(stake.createdAt),
        stake: (
          <Numeral
            value={stake.amount}
            decimals={getTokenDecimalsWithFallback(nativeToken?.decimals)}
            suffix={nativeToken?.symbol}
          />
        ),
        status: getStakeStatus(stake, motionStatesMap),
        // @TODO: Replace with action metadata title
        transfer: 'Pay X 1,000 ETH',
        motionDataId: stake.action?.motionData?.id ?? '',
      })),
    [userStakes, intl, nativeToken, motionStatesMap],
  );

  const stakesByFilterType = stakesFilterOptions.reduce((stakes, option) => {
    const updatedStakes = {
      ...stakes,
      [option.type]: stakesWithStatus.filter((stake) =>
        option.stakeStatuses.includes(stake.status),
      ),
    };

    return updatedStakes;
  }, {} as Record<StakesFilterType, StakesTabContentListItem[]>);

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
