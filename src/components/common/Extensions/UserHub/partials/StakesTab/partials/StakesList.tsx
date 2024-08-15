import clsx from 'clsx';
import React from 'react';

import { SpinnerLoader } from '~shared/Preloaders/index.ts';

import { type StakesListProps } from '../types.ts';

import StakeItem from './StakeItem.tsx';

import styles from './StakesList.module.css';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakeItem';

const StakesList = ({ stakes, loading }: StakesListProps) => {
  if (loading) {
    return (
      <div className="mx-auto w-fit pt-6">
        <SpinnerLoader appearance={{ size: 'small' }} />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        styles.stakesListContainer,
        'h-[60vh] w-full overflow-auto py-2 sm:max-h-[calc(22rem-1px)] sm:px-0 sm:py-0',
      )}
    >
      {stakes.map((stake) => (
        <StakeItem key={stake.id} stake={stake} />
      ))}
    </div>
  );
};

StakesList.displayName = displayName;

export default StakesList;
