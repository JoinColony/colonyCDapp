import React from 'react';
import { defineMessages } from 'react-intl';

import { MiniSpinnerLoader } from '~shared/Preloaders';
import { MotionData } from '~types';

import SingleTotalStake from './SingleTotalStake';
import StakingInput from './StakingInput';

import styles from './StakingWidget.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget';

const MSG = defineMessages({
  loading: {
    id: `${displayName}.loading`,
    defaultMessage: 'Loading staking values ...',
  },
});

interface StakingWidgetProps {
  motionData: MotionData;
}

const StakingWidget = ({ motionData: { motionId } }: StakingWidgetProps) => {
  const loadingStakeData = false;

  if (loadingStakeData) {
    return (
      <div className={styles.main}>
        <MiniSpinnerLoader
          className={styles.loading}
          loadingText={MSG.loading}
        />
      </div>
    );
  }

  return (
    <div className={styles.main} data-test="stakingWidget">
      {/* {isSummary ? (
        <GroupedTotalStake />
      ) : <> */}
      {/*
      </>)
        */}
      <SingleTotalStake />
      <StakingInput motionId={motionId} />
    </div>
  );
};

StakingWidget.displayName = displayName;

export default StakingWidget;
