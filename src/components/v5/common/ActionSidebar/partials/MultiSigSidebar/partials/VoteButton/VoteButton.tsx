import React from 'react';
import { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type ColonyActionType, type MultiSigVote } from '~gql';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type VoteOnMultiSigActionPayload } from '~redux/sagas/multiSig/voteOnMultiSig.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { getMultiSigRequiredRole } from '~utils/multiSig.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.VoteButton';

interface VoteButtonProps {
  actionType: ColonyActionType;
  multiSigId: string;
  multiSigDomainId: number;
  voteType: Exclude<MultiSigVote, MultiSigVote.None>;
}

const VoteButton: FC<VoteButtonProps> = ({
  actionType,
  multiSigId,
  multiSigDomainId,
  voteType,
}) => {
  const { colony } = useColonyContext();
  const voteOnMultiSig = useAsyncFunction({
    submit: ActionTypes.MULTISIG_VOTE,
    error: ActionTypes.MULTISIG_VOTE_ERROR,
    success: ActionTypes.MULTISIG_VOTE_SUCCESS,
  });

  const handleVoteClick = async () => {
    const voteForPayload: VoteOnMultiSigActionPayload = {
      colonyAddress: colony.colonyAddress,
      colonyDomains: extractColonyDomains(colony.domains),
      colonyRoles: extractColonyRoles(colony.roles),
      vote: voteType,
      domainId: multiSigDomainId,
      multiSigId,
      requiredRole: getMultiSigRequiredRole(actionType),
    };

    await voteOnMultiSig(voteForPayload);
  };

  return <Button onClick={handleVoteClick}>{voteType}</Button>;
};

VoteButton.displayName = displayName;
export default VoteButton;
