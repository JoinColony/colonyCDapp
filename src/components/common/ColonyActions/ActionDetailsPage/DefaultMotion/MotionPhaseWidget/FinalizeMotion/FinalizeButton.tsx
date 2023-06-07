import React from 'react';

import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import { mapPayload } from '~utils/actions';
import { SetStateFn } from '~types';

const displayName = `common.ColonyActions.ActionDetailsPage.DefaultMotion.FinalizeMotion.FinalizeButton`;

interface FinalizeButtonProps {
  isFinalizable: boolean;
  motionId: string;
  startPollingAction: (pollingInterval: number) => void;
  setIsPolling: SetStateFn;
}

const FinalizeButton = ({
  isFinalizable,
  motionId,
  startPollingAction,
  setIsPolling,
}: FinalizeButtonProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  const transform = mapPayload(() => ({
    colonyAddress: colony?.colonyAddress,
    userAddress: user?.walletAddress,
    motionId,
  }));

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
