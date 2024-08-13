import React from 'react';
import { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import { type ButtonProps } from '~v5/shared/Button/types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.CancelButton';

interface CancelButtonProps {
  multiSigId: string;
  handleLoadingChange: (isLoading: boolean) => void;
  isLoading: boolean;
  buttonProps?: ButtonProps;
}

const MSG = defineMessages({
  buttonReject: {
    id: `${displayName}.button.reject`,
    defaultMessage: 'Reject',
  },
});

const CancelButton: FC<CancelButtonProps> = ({
  multiSigId,
  handleLoadingChange,
  isLoading,
  buttonProps,
}) => {
  const { colony } = useColonyContext();

  const getCancelPayload = () => {
    handleLoadingChange(true);

    return {
      colonyAddress: colony.colonyAddress,
      motionId: multiSigId,
    };
  };

  return (
    <ActionButton
      isFullSize
      useTxLoader
      isLoading={isLoading}
      actionType={ActionTypes.MULTISIG_CANCEL}
      values={getCancelPayload}
      onError={() => {
        handleLoadingChange(false);
      }}
      mode="primaryOutline"
      {...buttonProps}
    >
      {formatText(MSG.buttonReject)}
    </ActionButton>
  );
};

CancelButton.displayName = displayName;
export default CancelButton;
