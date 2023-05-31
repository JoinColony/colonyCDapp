import React, { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useLocation } from 'react-router-dom';

import Numeral from '~shared/Numeral';
import { intl } from '~utils/intl';
import { ClaimMotionRewardsPayload } from '~redux/sagas/motions/claimMotionRewards';
import Button, { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';
import { useAppContext, useColonyContext } from '~hooks';
import { DetailItemProps } from '~shared/DetailsWidget';
import { getTransactionHashFromPathName } from '~utils/urls';

import { ClaimMotionStakesStyles } from './ClaimMotionStakes';
import { ColonyMotion } from '~types';

const { formatMessage } = intl({
  'label.stake': 'Stake',
  'label.winnings': 'Winnings',
  'label.penalty': 'Penalty',
  'label.total': 'Total',
  'label.claim': 'Claim your tokens',
});

const useClaimWidgetConfig = (
  { usersStakes, stakerRewards, databaseMotionId }: ColonyMotion,
  startPollingAction: (pollInterval: number) => void,
  styles: ClaimMotionStakesStyles,
) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const location = useLocation();
  const [isClaimed, setIsClaimed] = useState(false);

  const userAddress = user?.walletAddress;
  const colonyAddress = colony?.colonyAddress;
  const nativeTokenDecimals = colony?.nativeToken.decimals;
  const nativeTokenSymbol = colony?.nativeToken.symbol;

  const userStake = usersStakes.find(({ address }) => address === userAddress);
  const stakerReward = stakerRewards.find(
    ({ address }) => address === userAddress,
  );

  // Keep isClaimed state in sync with changes to unclaimed motions on colony object
  useEffect(() => {
    if (colony?.motionsWithUnclaimedStakes) {
      const motionIsUnclaimed = colony.motionsWithUnclaimedStakes.some(
        ({ motionId }) => motionId === databaseMotionId,
      );

      if (!motionIsUnclaimed) {
        setIsClaimed(true);
      } else {
        setIsClaimed(false);
      }
    }
  }, [colony?.motionsWithUnclaimedStakes, databaseMotionId]);

  // Keep isClaimed state in sync with user changes
  useEffect(() => {
    if (!user) {
      setIsClaimed(false);
    } else {
      setIsClaimed(!!stakerReward?.isClaimed);
    }
  }, [user, stakerReward]);

  const claimItem = {
    label: formatMessage({ id: 'label.claim' }),
    labelStyles: styles.claimLabel,
    item: (
      <Button
        appearance={{ theme: 'primary', size: 'medium' }}
        text={{ id: 'button.claim' }}
        disabled
      />
    ),
  };

  const config: DetailItemProps[] = [claimItem];

  // Return basic view if we have insufficient data
  if (!userStake || !stakerReward || !userAddress || !colonyAddress) {
    return config;
  }

  const {
    rewards: { yay: yayReward, nay: nayReward },
    isClaimed: isRewardClaimed,
  } = stakerReward;

  if (isRewardClaimed && !isClaimed) {
    setIsClaimed(true);
  }

  const {
    stakes: {
      raw: { nay: nayStakes, yay: yayStakes },
    },
  } = userStake;

  const totals = BigNumber.from(yayReward).add(nayReward);
  const userTotalStake = BigNumber.from(nayStakes).add(yayStakes);
  const userWinnings = totals.sub(userTotalStake);

  // Else, return full widget
  const buttonTextId = isClaimed ? 'button.claimed' : 'button.claim';
  const canClaimStakes = !totals.isZero() && !isClaimed;
  const handleClaimSuccess = () => {
    setIsClaimed(true);
    startPollingAction(1000);
  };

  const claimPayload = {
    userAddress,
    colonyAddress,
    transactionHash: getTransactionHashFromPathName(location.pathname),
  } as ClaimMotionRewardsPayload;

  claimItem.item = (
    <ActionButton
      actionType={ActionTypes.MOTION_CLAIM}
      values={claimPayload}
      appearance={{ theme: 'primary', size: 'medium' }}
      text={{ id: buttonTextId }}
      disabled={!canClaimStakes}
      dataTest="claimStakeButton"
      onSuccess={handleClaimSuccess}
    />
  );

  const stakeItem = {
    label: formatMessage({ id: 'label.stake' }),
    item: (
      <Numeral
        value={userTotalStake}
        decimals={nativeTokenDecimals}
        suffix={nativeTokenSymbol}
      />
    ),
  };

  const winningsItem = {
    label: formatMessage({
      id: userWinnings.gte(0) ? 'label.winnings' : 'label.penalty',
    }),
    item: (
      <Numeral
        value={userWinnings}
        decimals={nativeTokenDecimals}
        suffix={nativeTokenSymbol}
      />
    ),
  };

  const totalItem = {
    label: formatMessage({ id: 'label.total' }),
    item: (
      <Numeral
        value={totals}
        decimals={nativeTokenDecimals}
        suffix={nativeTokenSymbol}
      />
    ),
  };

  config.push(stakeItem, winningsItem, totalItem);

  return config;
};

export default useClaimWidgetConfig;
