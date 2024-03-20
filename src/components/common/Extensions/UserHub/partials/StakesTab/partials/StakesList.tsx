import { Binoculars } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';

import { type StakesListProps } from '../types.ts';

import StakeItem from './StakeItem.tsx';

import styles from './StakesList.module.css';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakeItem';

const StakesList = ({ stakes, loading, colony }: StakesListProps) => {
  if (loading) {
    return (
      <div className="mx-auto w-fit">
        <SpinnerLoader appearance={{ size: 'small' }} />
      </div>
    );
  }

  if (!stakes.length) {
    return (
      <EmptyContent
        title={{ id: 'empty.content.title.stakes' }}
        description={{ id: 'empty.content.subtitle.stakes' }}
        icon={Binoculars}
      />
    );
  }

  return (
    <div
      className={clsx(
        styles.stakesListContainer,
        'h-[60vh] w-full overflow-x-hidden overflow-y-scroll pr-1 sm:max-h-[22.25rem]',
      )}
    >
      {stakes.map((stake) => (
        <StakeItem
          key={stake.id}
          stake={stake}
          nativeToken={colony.nativeToken}
          colony={colony}
        />
      ))}
    </div>
  );
};

StakesList.displayName = displayName;

export default StakesList;
