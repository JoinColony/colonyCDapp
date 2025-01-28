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
  chainId,
  actionType = ActionTypes.CLAIM_TOKEN,
  ...rest
}) => {
  const { colony, canInteractWithColony } = useColonyContext();
  const [isClaimed, setIsClaimed] = useState(false);

  const {
    isAcceptLoading,
    enableAcceptLoading,
    setPendingFundsTokenAddresses,
    reset,
  } = useIncomingFundsLoadingContext();

  // Used to set acceptLoading in the context whilst transaction is processed
  const getPayload = () => {
    enableAcceptLoading();

    return {
      colonyAddress: colony?.colonyAddress,
      tokenAddresses,
      chainId,
    };
  };

  const handleClaimSuccess = () => {
    setIsClaimed(true);
    setPendingFundsTokenAddresses(tokenAddresses);
  };

  const isBtnDisabled =
    disabled || !canInteractWithColony || isClaimed || isAcceptLoading;
  // @Note: need to check how to differentiate between the ActionTypes.PROXY_COLONY_CLAIM_TOKEN and ActionTypes.CLAIM_TOKEN
  return (
    <ActionButton
      {...rest}
      actionType={actionType}
      onSuccess={handleClaimSuccess}
      onError={reset}
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
