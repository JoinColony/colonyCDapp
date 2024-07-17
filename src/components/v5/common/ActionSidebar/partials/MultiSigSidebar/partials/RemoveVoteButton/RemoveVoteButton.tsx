import { SpinnerGap } from '@phosphor-icons/react';
import React from 'react';
import { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { MultiSigVote, type ColonyActionType } from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { mapPayload } from '~utils/actions.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { getRolesNeededForMultiSigAction } from '~utils/multiSig.ts';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';

import { VoteExpectedStep } from '../MultiSigWidget/types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.RemoveVoteButton';

interface RemoveVoteButtonProps {
  actionType: ColonyActionType;
  multiSigId: string;
  multiSigDomainId: number;
  isPending: boolean;
  setExpectedStep: (step: VoteExpectedStep) => void;
}

const MSG = defineMessages({
  remove: {
    id: `${displayName}.remove`,
    defaultMessage: 'Remove',
  },
});

const RemoveVoteButton: FC<RemoveVoteButtonProps> = ({
  actionType,
  multiSigId,
  multiSigDomainId,
  isPending,
  setExpectedStep,
}) => {
  const { colony } = useColonyContext();

  const transform = mapPayload(() => ({
    colonyAddress: colony.colonyAddress,
    colonyDomains: extractColonyDomains(colony.domains),
    colonyRoles: extractColonyRoles(colony.roles),
    vote: MultiSigVote.None,
    domainId: multiSigDomainId,
    multiSigId,
    requiredRoles:
      getRolesNeededForMultiSigAction({
        actionType,
        createdIn: multiSigDomainId,
      }) || [],
  }));

  return (
    <ActionForm
      actionType={ActionTypes.MULTISIG_VOTE}
      transform={transform}
      onSuccess={() => setExpectedStep(VoteExpectedStep.vote)}
    >
      {({ formState: { isSubmitting } }) =>
        isSubmitting || isPending ? (
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
            {formatText(MSG.remove)}
          </Button>
        )
      }
    </ActionForm>
  );
};

RemoveVoteButton.displayName = displayName;
export default RemoveVoteButton;
