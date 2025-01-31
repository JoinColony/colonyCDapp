import React, { type FC, type PropsWithChildren, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useIncomingFundsLoadingContext } from '~frame/v5/pages/FundsPage/context/IncomingFundsLoadingContext.ts';
import { ActionTypes } from '~redux/index.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import { type ButtonProps } from '~v5/shared/Button/types.ts';

const displayName = 'pages.FundsPage.partials.AcceptButton';

interface AcceptButtonProps extends Pick<ButtonProps, 'disabled'> {
  tokenAddressesGroupedByChain: {
    chainId?: string;
    tokenAddresses: string[];
  }[];
}

const AcceptButton: FC<AcceptButtonProps & PropsWithChildren> = ({
  tokenAddressesGroupedByChain,
  children,
  disabled,
}) => {
  const { colony, canInteractWithColony } = useColonyContext();
  const [isClaimed, setIsClaimed] = useState(false);
  const allTokenAddresses = [
    ...new Set(
      tokenAddressesGroupedByChain.flatMap((group) => group.tokenAddresses),
    ),
  ];

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
      tokenAddressesGroupedByChain,
    };
  };

  const handleClaimSuccess = () => {
    setIsClaimed(true);
    setPendingFundsTokenAddresses(allTokenAddresses);
  };

  const isBtnDisabled =
    disabled || !canInteractWithColony || isClaimed || isAcceptLoading;

  return (
    <ActionButton
      actionType={ActionTypes.CLAIM_TOKENS_ON_CHAINS}
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
