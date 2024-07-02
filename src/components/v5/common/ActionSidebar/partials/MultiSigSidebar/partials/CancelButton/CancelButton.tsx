import { SpinnerGap } from '@phosphor-icons/react';
import React from 'react';
import { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';

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

  const transform = mapPayload(() => ({
    colonyAddress: colony.colonyAddress,
    motionId: multiSigId,
  }));

  return (
    <ActionForm
      actionType={ActionTypes.MULTISIG_CANCEL}
      transform={transform}
      onSuccess={() => setExpectedStep(VoteExpectedStep.cancel)}
    >
      {({ formState: { isSubmitting } }) =>
        isPending || isSubmitting ? (
          <TxButton
            rounded="s"
            isFullSize
            text={{ id: 'button.pending' }}
            icon={
              <span className="ml-2 flex shrink-0">
                <SpinnerGap size={18} className="animate-spin" />
              </span>
            }
            className="!px-4 !text-md"
          />
        ) : (
          <Button type="submit" mode="primaryOutline" isFullSize>
            {formatText(MSG.buttonReject)}
          </Button>
        )
      }
    </ActionForm>
  );
};

CancelButton.displayName = displayName;
export default CancelButton;
