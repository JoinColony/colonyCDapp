import React, { useMemo } from 'react';
import { MotionState as NetworkMotionState } from '@colony/colony-js';

import { SpinnerLoader } from '~shared/Preloaders';
import EmptyContent from '~v5/common/EmptyContent';

import StakeItem from './StakeItem';
import { StakesFilterOption, StakesListProps } from '../types';

const isFilterOptionDataLoading = (
  filterOption: StakesFilterOption,
  motionStatesLoading: boolean,
) => {
  switch (filterOption) {
    case 'all':
      return false;
    case 'finalizable':
    case 'claimable':
      return motionStatesLoading;
    default:
      return false;
  }
};

const StakesList = ({
  loading,
  stakes,
  colony,
  filterOption,
  motionStatesMap,
  onMotionStateFetched,
}: StakesListProps) => {
  /**
   * Count the number of stakes that stake on a motion and compare it to the number of motion
   * states fetched to determine if the states are still loading.
   */
  const motionStakesCount = stakes.filter(
    (stake) => !!stake.action?.motionData,
  ).length;
  const motionStatesLoading = motionStakesCount > motionStatesMap.size;

  const filteredStakes = useMemo(
    () =>
      stakes.filter((stake) => {
        if (filterOption === 'all') {
          return true;
        }
        if (filterOption === 'finalizable') {
          const motionState = motionStatesMap.get(stake.id);
          return (
            !stake.isClaimed && motionState === NetworkMotionState.Finalizable
          );
        }
        if (filterOption === 'claimable') {
          const motionState = motionStatesMap.get(stake.id);
          return (
            !stake.isClaimed && motionState === NetworkMotionState.Finalized
          );
        }
        return false;
      }),
    [filterOption, motionStatesMap, stakes],
  );

  if (loading || isFilterOptionDataLoading(filterOption, motionStatesLoading)) {
    return <SpinnerLoader appearance={{ size: 'small' }} />;
  }

  if (!stakes.length) {
    return (
      <EmptyContent
        title={{ id: 'empty.content.title.stakes' }}
        description={{ id: 'empty.content.subtitle.stakes' }}
        icon="binoculars"
      />
    );
  }

  return (
    <>
      {filteredStakes.map((stake) => (
        <StakeItem
          key={stake.id}
          title={stake.action?.type.toString() ?? ''}
          date={stake.createdAt}
          stake={stake.amount}
          transfer=""
          status={stake.isClaimed ? 'claimed' : 'staking'}
          userStake={stake}
          nativeToken={colony.nativeToken}
          colonyAddress={colony.colonyAddress}
          onMotionStateFetched={onMotionStateFetched}
        />
      ))}
    </>
  );
};

export default StakesList;
