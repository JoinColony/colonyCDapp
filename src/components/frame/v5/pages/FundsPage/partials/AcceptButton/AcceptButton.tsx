import React, { FC, useState } from 'react';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { mergePayload } from '~utils/actions';
import ActionButton from '~v5/shared/Button/ActionButton';

import { AcceptButtonProps } from './types';

const displayName = 'pages.FundsPage.partials.AcceptButton';

const AcceptButton: FC<AcceptButtonProps> = ({
  tokenAddresses,
  children,
  disabled,
  ...rest
}) => {
  const {
    colony,
    canInteractWithColony,
    startPollingColonyData,
    stopPollingColonyData,
  } = useColonyContext();
  const [isClaimed, setIsClaimed] = useState(false);

  const transform = mergePayload({
    colonyAddress: colony?.colonyAddress,
    tokenAddresses,
  });

  const handleClaimSuccess = () => {
    setIsClaimed(true);
    startPollingColonyData(1_000);
    setTimeout(stopPollingColonyData, 10_000);
  };

  return (
    <ActionButton
      {...rest}
      actionType={ActionTypes.CLAIM_TOKEN}
      transform={transform}
      onSuccess={handleClaimSuccess}
      disabled={disabled || !canInteractWithColony || isClaimed}
      mode="primarySolid"
      size="small"
    >
      {children}
    </ActionButton>
  );
};

AcceptButton.displayName = displayName;

export default AcceptButton;
