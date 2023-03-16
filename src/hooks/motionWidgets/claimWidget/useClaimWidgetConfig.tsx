import React, { useState } from 'react';
import Decimal from 'decimal.js';

import { MotionSide } from '~hooks/motionWidgets/stakingWidget/helpers';

import Numeral from '~shared/Numeral';
import { intl } from '~utils/intl';
import { MotionData } from '~types';
import Button, { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';
import { useAppContext, useColonyContext } from '~hooks';

const { formatMessage } = intl({
  'label.stake': 'Stake',
  'label.winnings': 'Winnings',
  'label.total': 'Total',
  'label.claim': 'Claim your tokens',
});

const useClaimWidgetConfig = ({
  motionId,
  usersStakes,
  stakerRewards,
  isClaimed,
}: MotionData) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const [rewardsClaimed, setRewardsClaimed] = useState(isClaimed);

  const userAddress = user?.walletAddress;
  const colonyAddress = colony?.colonyAddress;
  const nativeTokenDecimals = colony?.nativeToken.decimals;
  const nativeTokenSymbol = colony?.nativeToken.symbol;

  const userStake = usersStakes.find(({ address }) => address === userAddress);
  const stakerReward = stakerRewards.find(
    ({ address }) => address === userAddress,
  );
  const claimItem = {
    label: formatMessage({ id: 'label.claim' }),
    item: (
      <Button
        appearance={{ theme: 'primary', size: 'medium' }}
        text={{ id: 'button.claim' }}
        disabled
        dataTest="claimStakeButton"
      />
    ),
  };

  const config = [claimItem];

  if (!userStake || !stakerReward || !userAddress || !colonyAddress) {
    return config;
  }

  const {
    rewards: {
      raw: { yay: yayReward, nay: nayReward },
    },
  } = stakerReward;

  const {
    stakes: {
      raw: { nay: nayStakes, yay: yayStakes },
    },
  } = userStake;

  const totals = new Decimal(yayReward).add(nayReward);
  const userTotalStake = new Decimal(nayStakes).add(yayStakes);
  const userWinnings = totals.sub(userTotalStake);
  const canClaimStakes = !userTotalStake.isZero();
  const claims = [
    { [MotionSide.NAY]: nayReward },
    { [MotionSide.YAY]: yayReward },
  ].filter((claim) => Object.values(claim)[0] !== '0');

  const buttonTextId = rewardsClaimed ? 'button.claimed' : 'button.claim';
  claimItem.item = (
    <ActionButton
      actionType={ActionTypes.MOTION_CLAIM}
      values={{
        userAddress,
        colonyAddress,
        motionId,
        claims,
      }}
      appearance={{ theme: 'primary', size: 'medium' }}
      text={{ id: buttonTextId }}
      disabled={!canClaimStakes || rewardsClaimed}
      dataTest="claimStakeButton"
      onSuccess={() => setRewardsClaimed(true)}
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
    label: formatMessage({ id: 'label.winnings' }),
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
