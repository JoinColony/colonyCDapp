import React, { Dispatch, SetStateAction } from 'react';
import { BigNumber } from 'ethers';
import { defineMessages } from 'react-intl';

import Button from '~shared/Button';
import { ActionHookForm as ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux/actionTypes';
import { Address } from '~types/index';
import { mapPayload } from '~utils/actions';

import { MotionStakedEvent } from './types';

const displayName = 'frame.TokenActivation.StakesTab.ClaimAllButton';

const MSG = defineMessages({
  claimAll: {
    id: `${displayName}.claimAll`,
    defaultMessage: 'Claim all',
  },
});

interface Props {
  unclaimedMotionStakeEvents: MotionStakedEvent[];
  colonyAddress: Address;
  userAddress: Address;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
}

const ClaimAllButton = ({ unclaimedMotionStakeEvents, userAddress, colonyAddress, setIsPopoverOpen }: Props) => {
  const uniqueMotionIds = [
    ...new Set(unclaimedMotionStakeEvents.map((motionStakeEvent) => motionStakeEvent.values.motionId)),
  ];

  const transform = mapPayload(() => ({
    colonyAddress,
    userAddress,
    motionIds: uniqueMotionIds.map((motionId) => BigNumber.from(motionId)),
  }));

  return (
    <ActionForm
      defaultValues={{}}
      actionType={ActionTypes.MOTION_CLAIM}
      submit={ActionTypes.MOTION_CLAIM}
      error={ActionTypes.MOTION_CLAIM_ERROR}
      success={ActionTypes.MOTION_CLAIM_SUCCESS}
      transform={transform}
      onSuccess={setIsPopoverOpen}
    >
      {({ formState: { isSubmitting } }) => (
        <Button
          type="submit"
          appearance={{ theme: 'primary', size: 'medium' }}
          text={MSG.claimAll}
          loading={isSubmitting}
          disabled={isSubmitting}
          dataTest="claimAllStakesButton"
        />
      )}
    </ActionForm>
  );
};

export default ClaimAllButton;

ClaimAllButton.displayName = displayName;
