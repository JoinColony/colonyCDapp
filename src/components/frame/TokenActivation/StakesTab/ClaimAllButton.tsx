import React, { Dispatch, SetStateAction } from 'react';
import { BigNumber } from 'ethers';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';

import Button from '~shared/Button';
import { ActionForm } from '~shared/Fields';
import { ParsedMotionStakedEvent } from '~gql';
import { ActionTypes } from '~redux/actionTypes';
import { Address } from '~types/index';
import { mapPayload } from '~utils/actions';

const displayName = 'TokenActivation.StakesTab.ClaimAllButton';

const MSG = defineMessages({
  claimAll: {
    id: `users.TokenActivation.StakesTab.ClaimAllButton.claimAll`,
    defaultMessage: 'Claim all',
  },
});

interface Props {
  unclaimedMotionStakeEvents: ParsedMotionStakedEvent[];
  colonyAddress: Address;
  userAddress: Address;
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
}

const ClaimAllButton = ({
  unclaimedMotionStakeEvents,
  userAddress,
  colonyAddress,
  setIsPopoverOpen,
}: Props) => {
  const uniqueMotionIds = [
    ...new Set(
      unclaimedMotionStakeEvents.map(
        (motionStakeEvent) => motionStakeEvent.values.motionId,
      ),
    ),
  ];

  const transform = mapPayload(() => ({
    colonyAddress,
    userAddress,
    motionIds: uniqueMotionIds.map((motionId) => BigNumber.from(motionId)),
  }));

  return (
    <ActionForm
      initialValues={{}}
      submit={ActionTypes.MOTION_CLAIM}
      error={ActionTypes.MOTION_CLAIM_ERROR}
      success={ActionTypes.MOTION_CLAIM_SUCCESS}
      transform={transform}
      onSuccess={setIsPopoverOpen}
      onError={setIsPopoverOpen}
    >
      {({ handleSubmit, isSubmitting }: FormikProps<unknown>) => (
        <Button
          appearance={{ theme: 'primary', size: 'medium' }}
          text={MSG.claimAll}
          onClick={() => handleSubmit()}
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
