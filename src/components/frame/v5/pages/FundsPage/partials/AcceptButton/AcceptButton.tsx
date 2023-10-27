import React, { FC, useState } from 'react';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { mergePayload } from '~utils/actions';
import ActionButton from '~v5/shared/Button/ActionButton';

import { AcceptButtonProps } from './types';

const AcceptButton: FC<AcceptButtonProps> = ({ tokenAddress }) => {
  const {
    colony,
    canInteractWithColony,
    startPolling: startPollingColony,
    stopPolling: stopPollingColony,
  } = useColonyContext();
  const [isClaimed, setIsClaimed] = useState(false);

  const transform = mergePayload({
    colonyAddress: colony?.colonyAddress,
    tokenAddress,
  });

  const handleClaimSuccess = () => {
    setIsClaimed(true);
    startPollingColony(1_000);
    setTimeout(stopPollingColony, 10_000);
  };

  return (
    <ActionButton
      text="Accept"
      actionType={ActionTypes.CLAIM_TOKEN}
      transform={transform}
      onSuccess={handleClaimSuccess}
      disabled={!canInteractWithColony || isClaimed}
      mode="primarySolid"
    />
  );
};

export default AcceptButton;
