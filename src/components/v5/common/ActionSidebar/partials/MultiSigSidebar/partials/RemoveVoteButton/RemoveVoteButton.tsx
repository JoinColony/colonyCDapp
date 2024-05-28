import React from 'react';
import { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { MultiSigVote, type ColonyActionType, type Domain } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type VoteOnMultiSigActionPayload } from '~redux/sagas/multiSig/voteOnMultiSig.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { getMultiSigRequiredRole } from '~utils/multiSig.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.RemoveVoteButton';

interface RemoveVoteButtonProps {
  actionType: ColonyActionType;
  multiSigId: string;
  multiSigDomain: Domain;
}

const RemoveVoteButton: FC<RemoveVoteButtonProps> = ({
  actionType,
  multiSigId,
  multiSigDomain,
}) => {
  const { colony } = useColonyContext();
  const voteOnMultiSig = useAsyncFunction({
    submit: ActionTypes.MULTISIG_VOTE,
    error: ActionTypes.MULTISIG_VOTE_ERROR,
    success: ActionTypes.MULTISIG_VOTE_SUCCESS,
  });

  const handleRemoveVoteClick = async () => {
    const voteForPayload: VoteOnMultiSigActionPayload = {
      colonyAddress: colony.colonyAddress,
      colonyRoles: extractColonyRoles(colony.roles),
      vote: MultiSigVote.None,
      domain: multiSigDomain,
      multiSigId,
      requiredRole: getMultiSigRequiredRole(actionType),
    };

    await voteOnMultiSig(voteForPayload);
  };

  return <Button onClick={handleRemoveVoteClick}>Remove vote</Button>;
};

RemoveVoteButton.displayName = displayName;
export default RemoveVoteButton;
