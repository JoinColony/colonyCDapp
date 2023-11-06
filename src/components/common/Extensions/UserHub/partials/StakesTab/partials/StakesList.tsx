import React, { useMemo } from 'react';

import { SpinnerLoader } from '~shared/Preloaders';
import EmptyContent from '~v5/common/EmptyContent';

import StakeItem from './StakeItem';
import { StakesListProps } from '../types';
import {
  filterStakeByFilterOption,
  isFilterOptionDataLoading,
} from '../helpers';

const StakesList = ({
  loading,
  stakes,
  colony,
  filterOption,
  motionStatesMap,
  onMotionStateFetched,
  motionStatesLoading,
}: StakesListProps) => {
  const filteredStakes = useMemo(
    () =>
      stakes.filter((stake) =>
        filterStakeByFilterOption(stake, filterOption, motionStatesMap),
      ),
    [filterOption, motionStatesMap, stakes],
  );

  if (loading || isFilterOptionDataLoading(filterOption, motionStatesLoading)) {
    return <SpinnerLoader appearance={{ size: 'small' }} />;
  }

  if (!filteredStakes.length) {
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
