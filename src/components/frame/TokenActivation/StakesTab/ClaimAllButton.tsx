import React, { Dispatch, SetStateAction } from 'react';
import { defineMessages } from 'react-intl';

import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux/actionTypes';
import { Address, UnclaimedStakes } from '~types/index';

const displayName = 'frame.TokenActivation.StakesTab.ClaimAllButton';

const MSG = defineMessages({
  claimAll: {
    id: `${displayName}.claimAll`,
    defaultMessage: 'Claim all',
  },
});

interface Props {
  unclaimedStakes: UnclaimedStakes[];
  colonyAddress: Address;
  userAddress: Address;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
}

const ClaimAllButton = ({
  unclaimedStakes,
  userAddress,
  colonyAddress,
  setIsPopoverOpen,
}: Props) => (
  <ActionButton
    actionType={ActionTypes.MOTION_CLAIM_ALL}
    values={{
      colonyAddress,
      userAddress,
      motionIds: unclaimedStakes.map(({ motionId }) => motionId),
    }}
    appearance={{ theme: 'primary', size: 'medium' }}
    text={MSG.claimAll}
    dataTest="claimAllStakesButton"
    onSuccess={() => setIsPopoverOpen(false)}
  />
);

export default ClaimAllButton;

ClaimAllButton.displayName = displayName;
