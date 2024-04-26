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

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.FinalizeButton';

interface FinalizeButtonProps {
  multiSigId: string;
  isPending: boolean;
  setIsPending: (isPending: boolean) => void;
}

const MSG = defineMessages({
  finalizeButton: {
    id: `${displayName}.finalizeButton`,
    defaultMessage: 'Finalize approve',
  },
});

const FinalizeButton: FC<FinalizeButtonProps> = ({
  multiSigId,
  isPending,
  setIsPending,
}) => {
  const { colony } = useColonyContext();
  const transform = mapPayload(() => ({
    colonyAddress: colony.colonyAddress,
    multiSigId,
  }));

  return (
    <ActionForm
      actionType={ActionTypes.MULTISIG_FINALIZE}
      transform={transform}
      onSuccess={() => setIsPending(true)}
      onError={() => setIsPending(false)}
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
          <Button type="submit" isFullSize>
            {formatText(MSG.finalizeButton)}
          </Button>
        )
      }
    </ActionForm>
  );
};

FinalizeButton.displayName = displayName;
export default FinalizeButton;
