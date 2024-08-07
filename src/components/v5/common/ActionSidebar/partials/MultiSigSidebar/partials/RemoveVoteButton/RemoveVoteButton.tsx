import React from 'react';
import { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { MultiSigVote, type ColonyActionType } from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { getRolesNeededForMultiSigAction } from '~utils/multiSig/index.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

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

  const removeVotePayload = {
    colonyAddress: colony.colonyAddress,
    colonyDomains: extractColonyDomains(colony.domains),
    colonyRoles: extractColonyRoles(colony.roles),
    vote: MultiSigVote.None,
    domainId: multiSigDomainId,
    multiSigId,
    roles:
      getRolesNeededForMultiSigAction({
        actionType,
        createdIn: multiSigDomainId,
      }) || [],
  };

  return (
    <ActionButton
      useTxLoader
      isFullSize
      isLoading={isPending}
      actionType={ActionTypes.MULTISIG_VOTE}
      onSuccess={() => setExpectedStep(VoteExpectedStep.vote)}
      values={removeVotePayload}
    >
      {formatText(MSG.remove)}
    </ActionButton>
  );
};

RemoveVoteButton.displayName = displayName;
export default RemoveVoteButton;
