import React from 'react';
import { defineMessages } from 'react-intl';

import { MiniSpinnerLoader } from '~shared/Preloaders';

import { SingleTotalStake, GroupedTotalStake } from './TotalStakeWidget';
import StakingInput from './StakingInput';
import { useStakingWidgetContext } from './StakingWidgetProvider';

import styles from './StakingWidget.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget';

const MSG = defineMessages({
  loading: {
    id: `${displayName}.loading`,
    defaultMessage: 'Loading staking values ...',
  },
});
const StakingWidget = () => {
  const { isSummary, loadingStakeData } = useStakingWidgetContext();

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
      {isSummary ? (
        <GroupedTotalStake />
      ) : (
        <>
          <SingleTotalStake />
          <StakingInput />
        </>
      )}
    </div>
  );
};

StakingWidget.displayName = displayName;

export default StakingWidget;
