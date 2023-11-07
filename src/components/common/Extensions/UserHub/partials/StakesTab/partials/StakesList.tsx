import React from 'react';

import { SpinnerLoader } from '~shared/Preloaders';
import EmptyContent from '~v5/common/EmptyContent';

import StakeItem from './StakeItem';
import { StakesListProps } from '../types';

const StakesList = ({ stakes, loading, colony }: StakesListProps) => {
  if (loading) {
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
      {stakes.map((stake) => (
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
        />
      ))}
    </>
  );
};

export default StakesList;
