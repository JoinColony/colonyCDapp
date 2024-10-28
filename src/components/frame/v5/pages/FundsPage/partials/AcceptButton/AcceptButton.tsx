import React, { type FC, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useIncomingFundsLoadingContext } from '~frame/v5/pages/FundsPage/context/IncomingFundsLoadingContext.ts';
import { ActionTypes } from '~redux/index.ts';
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

  // Used to set acceptLoading in the context whilst transaction is processed
  const getPayload = () => {
    enableAcceptLoading();

    return {
      colonyAddress: colony?.colonyAddress,
      tokenAddresses,
    };
  };

  const handleClaimSuccess = () => {
    setIsClaimed(true);
    startPollingColonyData(1_000);
    setTimeout(stopPollingColonyData, 10_000);
    disableAcceptLoading();
  };

  const isBtnDisabled =
    disabled || !canInteractWithColony || isClaimed || isAcceptLoading;
  return (
    <ActionButton
      {...rest}
      actionType={ActionTypes.CLAIM_TOKEN}
      onSuccess={handleClaimSuccess}
      onError={disableAcceptLoading}
      disabled={isBtnDisabled}
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
