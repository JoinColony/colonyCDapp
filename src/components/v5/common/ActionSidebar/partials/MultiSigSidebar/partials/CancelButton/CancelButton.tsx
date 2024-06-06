import React from 'react';
import { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.CancelButton';

interface CancelButtonProps {
  multiSigId: string;
}

const CancelButton: FC<CancelButtonProps> = ({ multiSigId }) => {
  const { colony } = useColonyContext();
  const cancelMultiSig = useAsyncFunction({
    submit: ActionTypes.MULTISIG_CANCEL,
    error: ActionTypes.MULTISIG_CANCEL_ERROR,
    success: ActionTypes.MULTISIG_CANCEL_SUCCESS,
  });

  const handleFinalizeClick = async () => {
    const cancelPayload = {
      colonyAddress: colony.colonyAddress,
      motionId: multiSigId,
    };

    await cancelMultiSig(cancelPayload);
  };

  return <Button onClick={handleFinalizeClick}>Cancel</Button>;
};

CancelButton.displayName = displayName;
export default CancelButton;
