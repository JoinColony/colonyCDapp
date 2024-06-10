import React from 'react';
import { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.FinalizeButton';

interface FinalizeButtonProps {
  multiSigId: string;
}

const FinalizeButton: FC<FinalizeButtonProps> = ({ multiSigId }) => {
  const { colony } = useColonyContext();
  const finalizeMultiSig = useAsyncFunction({
    submit: ActionTypes.MULTISIG_FINALIZE,
    error: ActionTypes.MULTISIG_FINALIZE_ERROR,
    success: ActionTypes.MULTISIG_FINALIZE_SUCCESS,
  });

  const handleFinalizeClick = async () => {
    const voteForPayload = {
      colonyAddress: colony.colonyAddress,
      multiSigId,
    };

    await finalizeMultiSig(voteForPayload);
  };

  return <Button onClick={handleFinalizeClick}>Finalize approval</Button>;
};

FinalizeButton.displayName = displayName;
export default FinalizeButton;
