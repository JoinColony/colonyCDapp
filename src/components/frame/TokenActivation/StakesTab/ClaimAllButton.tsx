import React from 'react';

import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux/actionTypes';
import { Address, UnclaimedStakes } from '~types/index';
import { useColonyContext, useTokenActivationContext } from '~hooks';

const displayName = 'frame.TokenActivation.StakesTab.ClaimAllButton';

interface Props {
  unclaimedStakes: UnclaimedStakes[];
  colonyAddress: Address;
  userAddress: Address;
}

const ClaimAllButton = ({
  unclaimedStakes,
  userAddress,
  colonyAddress,
}: Props) => {
  const { startPolling, stopPolling } = useColonyContext();
  const { setIsOpen } = useTokenActivationContext();
  return (
    <ActionButton
      actionType={ActionTypes.MOTION_CLAIM_ALL}
      values={{
        colonyAddress,
        userAddress,
        motionIds: unclaimedStakes.map(({ motionId }) => motionId),
      }}
      appearance={{ theme: 'primary', size: 'medium' }}
      text={{ id: 'button.claimAll' }}
      dataTest="claimAllStakesButton"
      onSuccess={() => {
        setIsOpen(false);
        startPolling(1000);
        setTimeout(stopPolling, 10_000);
      }}
    />
  );
};
export default ClaimAllButton;

ClaimAllButton.displayName = displayName;
