import React, { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ProgressBar from '~shared/ProgressBar';
import { Tooltip } from '~shared/Popover';
import { STAKING_THRESHOLD } from '~constants';

import UserStakeMessage from './UserStakeMessage';
import SingleTotalStakeHeading from './SingleTotalStakeHeading';
import { useStakingWidgetContext } from '../StakingWidgetProvider';

import styles from './SingleTotalStake.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.SingleTotalStake';

const MSG = defineMessages({
  progressTooltip: {
    id: `${displayName}.tooltip`,
    defaultMessage: `Stake above the minimum 10% threshold to make it visible to others within the Actions list.`,
  },
});

interface MinStakeTooltipProps {
  children: ReactNode;
}

const MinStakeTooltip = ({ children }: MinStakeTooltipProps) => (
  <Tooltip
    placement="left"
    trigger="hover"
    content={
      <div className={styles.tooltip}>
        <FormattedMessage {...MSG.progressTooltip} />
      </div>
    }
  >
    {children}
  </Tooltip>
);

const SingleTotalStake = () => {
  const {
    motionStakes: { percentage: percentageStaked },
    requiredStake,
    isObjection,
  } = useStakingWidgetContext();

  const totalPercentage = Number(
    isObjection ? percentageStaked.nay : percentageStaked.yay,
  );

  const isUnderThreshold = totalPercentage < STAKING_THRESHOLD;

  const progressBar = (
    <ProgressBar
      value={totalPercentage}
      threshold={10}
      max={100}
      appearance={{
        barTheme: isObjection ? 'danger' : 'primary',
        backgroundTheme: 'default',
        size: 'normal',
      }}
      hidePercentage
    />
  );

  return (
    <>
      <SingleTotalStakeHeading
        totalPercentage={totalPercentage}
        requiredStake={requiredStake}
      />
      {isUnderThreshold ? (
        <MinStakeTooltip>{progressBar}</MinStakeTooltip>
      ) : (
        progressBar
      )}
      <UserStakeMessage />
    </>
  );
};

SingleTotalStake.displayName = displayName;

export default SingleTotalStake;
