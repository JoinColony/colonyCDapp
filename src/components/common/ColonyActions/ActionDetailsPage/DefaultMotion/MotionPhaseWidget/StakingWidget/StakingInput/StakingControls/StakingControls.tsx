import React from 'react';

import { useAppContext, useColonyContext } from '~hooks';

import { useStakingWidgetContext } from '../../StakingWidgetProvider';
import { useEnoughTokensForStaking } from '../useEnoughTokensForStaking';
import { BackButton, ObjectButton, StakeButton } from '.';

import styles from './StakingControls.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakingWidgetControls';

const StakingControls = () => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const { colony, loading: loadingColony } = useColonyContext();
  const {
    motionStakes: {
      raw: { nay: nayStakes },
    },
    remainingToStake,
    userMinStake,
  } = useStakingWidgetContext();
  const { tokenAddress } = colony?.nativeToken || {};
  const showBackButton = nayStakes !== '0';
  const { loadingUserTokenBalance, enoughTokensToStakeMinimum } =
    useEnoughTokensForStaking(
      tokenAddress ?? '',
      user?.walletAddress ?? '',
      userMinStake,
    );
  const isLoadingData =
    loadingUserTokenBalance || userLoading || walletConnecting || loadingColony;
  return (
    <div className={styles.buttonGroup}>
      {showBackButton && <BackButton />}
      <StakeButton
        isLoadingData={isLoadingData}
        enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
        remainingToStake={remainingToStake}
      />
      {!showBackButton && (
        <ObjectButton
          isLoadingData={isLoadingData}
          enoughTokensToStakeMinimum={enoughTokensToStakeMinimum}
        />
      )}
      {/*
      {showActivateButton && <ActivateButton />}
      */}
    </div>
  );
};

StakingControls.displayName = displayName;

export default StakingControls;
