import React from 'react';
import { defineMessages } from 'react-intl';

import { MiniSpinnerLoader } from '~shared/Preloaders';

import {
  useStakingWidgetContext,
  StakingInput,
  SingleTotalStake,
  GroupedTotalStake,
} from '.';

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
  const { isSummary, isRefetching } = useStakingWidgetContext();

  if (isRefetching) {
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
