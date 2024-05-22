import React from 'react';
import { type FC } from 'react';

import { type ColonyActionType, MultiSigVote } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { getMultiSigRequiredRole } from '~utils/multiSig.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.VoteButton';

interface VoteButtonProps {
  actionType: ColonyActionType;
  multiSigColonyAddress: string;
  multiSigId: string;
  multiSigDomainId: number;
}

const VoteButton: FC<VoteButtonProps> = ({
  actionType,
  multiSigId,
  multiSigDomainId,
  multiSigColonyAddress,
}) => {
  const voteOnMultiSig = useAsyncFunction({
    submit: ActionTypes.MULTISIG_VOTE,
    error: ActionTypes.MULTISIG_VOTE_ERROR,
    success: ActionTypes.MULTISIG_VOTE_SUCCESS,
  });

  const handleVoteClick = async () => {
    const voteForPayload = {
      colonyAddress: multiSigColonyAddress,
      vote: MultiSigVote.Approve,
      domainId: multiSigDomainId,
      multiSigId,
      requiredRole: getMultiSigRequiredRole(actionType),
    };

    await voteOnMultiSig(voteForPayload);
  };

  return <Button onClick={handleVoteClick}>Approve</Button>;
};

VoteButton.displayName = displayName;
export default VoteButton;
