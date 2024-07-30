import React from 'react';
import { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

import { VoteExpectedStep } from '../MultiSigWidget/types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.CancelButton';

interface CancelButtonProps {
  multiSigId: string;
  isPending: boolean;
  setExpectedStep: (step: VoteExpectedStep) => void;
}

const MSG = defineMessages({
  buttonReject: {
    id: `${displayName}.button.reject`,
    defaultMessage: 'Reject',
  },
});

const CancelButton: FC<CancelButtonProps> = ({
  multiSigId,
  isPending,
  setExpectedStep,
}) => {
  const { colony } = useColonyContext();

  const cancelPayload = {
    colonyAddress: colony.colonyAddress,
    motionId: multiSigId,
  };

  return (
    <ActionButton
      isFullSize
      useTxLoader
      isLoading={isPending}
      actionType={ActionTypes.MULTISIG_CANCEL}
      onSuccess={() => {
        setExpectedStep(VoteExpectedStep.cancel);
      }}
      values={cancelPayload}
      mode="primaryOutline"
    >
      {formatText(MSG.buttonReject)}
    </ActionButton>
  );
};

CancelButton.displayName = displayName;
export default CancelButton;
