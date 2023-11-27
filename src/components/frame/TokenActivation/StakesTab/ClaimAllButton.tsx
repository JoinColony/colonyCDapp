import React from 'react';
import { Extension } from '@colony/colony-js';

import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux/actionTypes';
import { Address, UnclaimedStakes, InstalledExtensionData } from '~types';
import {
  useColonyContext,
  useTokenActivationContext,
  useExtensionData,
} from '~hooks';
import { useUserTokenBalanceContext } from '~context';

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
  const { pollLockedTokenBalance } = useUserTokenBalanceContext();
  const { setIsOpen } = useTokenActivationContext();
  const { extensionData: votingRepitationExtension } = useExtensionData(
    Extension.VotingReputation,
  );

  return (
    <ActionButton
      actionType={ActionTypes.MOTION_CLAIM_ALL}
      values={{
        colonyAddress,
        userAddress,
        extensionAddress: (votingRepitationExtension as InstalledExtensionData)
          ?.address,
        motionIds: unclaimedStakes.map(({ motionId }) => motionId),
      }}
      appearance={{ theme: 'primary', size: 'medium' }}
      text={{ id: 'button.claimAll' }}
      dataTest="claimAllStakesButton"
      onSuccess={() => {
        setIsOpen(false);
        startPolling(1000);
        setTimeout(stopPolling, 10_000);
        pollLockedTokenBalance();
      }}
    />
  );
};
export default ClaimAllButton;

ClaimAllButton.displayName = displayName;
