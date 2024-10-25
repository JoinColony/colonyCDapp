import React, { type FC, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useIncomingFundsLoadingContext } from '~frame/v5/pages/FundsPage/context/IncomingFundsLoadingContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { mergePayload } from '~utils/actions.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

import { type AcceptButtonProps } from './types.ts';

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

  const { isAcceptLoading, enableAcceptLoading, disableAcceptLoading } =
    useIncomingFundsLoadingContext();

  const transform = mergePayload({
    colonyAddress: colony?.colonyAddress,
    tokenAddresses,
  });

  const handleClaimSuccess = () => {
    setIsClaimed(true);
    startPollingColonyData(1_000);
    setTimeout(stopPollingColonyData, 10_000);
    disableAcceptLoading();
  };

  const getPayload = () => {
    enableAcceptLoading();
  };

  return (
    <ActionButton
      {...rest}
      actionType={ActionTypes.CLAIM_TOKEN}
      transform={transform}
      onSuccess={handleClaimSuccess}
      onError={disableAcceptLoading}
      disabled={
        disabled || !canInteractWithColony || isClaimed || isAcceptLoading
      }
      mode="primarySolid"
      size="small"
      values={getPayload}
    >
      {children}
    </ActionButton>
  );
};

AcceptButton.displayName = displayName;

export default AcceptButton;
