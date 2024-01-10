import React from 'react';

import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { MotionFinalizePayload } from '~redux/types/actions/motion';
import { ActionButton } from '~shared/Button';
import { SetStateFn } from '~types';
import { mapPayload } from '~utils/actions';

const displayName = `common.ColonyActions.ActionDetailsPage.DefaultMotion.FinalizeMotion.FinalizeButton`;

interface FinalizeButtonProps {
  isFinalizable: boolean;
  motionId: string;
  startPollingAction: (pollingInterval: number) => void;
  setIsPolling: SetStateFn;
  gasEstimate: string;
}

const FinalizeButton = ({
  isFinalizable,
  motionId,
  startPollingAction,
  setIsPolling,
  gasEstimate,
}: FinalizeButtonProps) => {
  const { user } = useAppContext();
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const transform = mapPayload(
    () =>
      ({
        colonyAddress,
        userAddress: user?.walletAddress,
        motionId,
        gasEstimate,
      } as MotionFinalizePayload),
  );

  const handleSuccess = () => {
    startPollingAction(1000);
    setIsPolling(true);
  };

  return (
    <ActionButton
      appearance={{ theme: 'primary', size: 'medium' }}
      text={{ id: 'button.finalize' }}
      disabled={!user || !isFinalizable}
      actionType={ActionTypes.MOTION_FINALIZE}
      transform={transform}
      dataTest="finalizeButton"
      onSuccess={handleSuccess}
    />
  );
};

FinalizeButton.displayName = displayName;

export default FinalizeButton;
