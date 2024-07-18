import { SpinnerGap } from '@phosphor-icons/react';
import React from 'react';
import { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type ColonyActionType, MultiSigVote } from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload } from '~utils/actions.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { getRolesNeededForMultiSigAction } from '~utils/multiSig.ts';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';
import { type ButtonProps } from '~v5/shared/Button/types.ts';

import { VoteExpectedStep } from '../MultiSigWidget/types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.VoteButton';

interface VoteButtonProps {
  actionType: ColonyActionType;
  multiSigId: string;
  multiSigDomainId: number;
  voteType: Exclude<MultiSigVote, MultiSigVote.None>;
  isPending: boolean;
  setExpectedStep: (step: VoteExpectedStep | null) => void;
  setCurrentVote: (vote: MultiSigVote | null) => void;
  buttonProps?: ButtonProps;
}

const MSG = defineMessages({
  approve: {
    id: `${displayName}.approve`,
    defaultMessage: 'Approve',
  },
  reject: {
    id: `${displayName}.reject`,
    defaultMessage: 'Reject',
  },
});

const VoteButton: FC<VoteButtonProps> = ({
  actionType,
  multiSigId,
  multiSigDomainId,
  voteType,
  buttonProps,
  setExpectedStep,
  setCurrentVote,
  isPending,
}) => {
  const { colony } = useColonyContext();

  const buttonText = {
    [MultiSigVote.Approve]: MSG.approve,
    [MultiSigVote.Reject]: MSG.reject,
  };

  const transform = mapPayload(() => ({
    colonyAddress: colony.colonyAddress,
    colonyDomains: extractColonyDomains(colony.domains),
    colonyRoles: extractColonyRoles(colony.roles),
    vote: voteType,
    domainId: multiSigDomainId,
    multiSigId,
    roles:
      getRolesNeededForMultiSigAction({
        actionType,
        createdIn: multiSigDomainId,
      }) || [],
  }));

  return (
    <ActionForm
      actionType={ActionTypes.MULTISIG_VOTE}
      transform={transform}
      onSuccess={() => {
        setExpectedStep(VoteExpectedStep.cancel);
      }}
      onError={() => {
        setExpectedStep(null);
      }}
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
          <Button
            type="submit"
            {...buttonProps}
            isFullSize
            onClick={() => setCurrentVote(voteType)}
          >
            {formatText(buttonText[voteType])}
          </Button>
        )
      }
    </ActionForm>
  );
};

VoteButton.displayName = displayName;
export default VoteButton;
