import { type ColonyRole } from '@colony/colony-js';
import React from 'react';
import { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { MultiSigVote } from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type VoteOnMultiSigActionPayload } from '~redux/sagas/multiSig/voteOnMultiSig.ts';
import { type MultiSigAction } from '~types/motions.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import { LoadingBehavior } from '~v5/shared/Button/types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.RemoveVoteButton';

interface RemoveVoteButtonProps {
  requiredRoles: ColonyRole[];
  handleLoadingChange: (isLoading: boolean) => void;
  isLoading: boolean;
  action: MultiSigAction;
}

const MSG = defineMessages({
  remove: {
    id: `${displayName}.remove`,
    defaultMessage: 'Remove',
  },
});

const RemoveVoteButton: FC<RemoveVoteButtonProps> = ({
  requiredRoles,
  handleLoadingChange,
  isLoading,
  action,
}) => {
  const { colony } = useColonyContext();

  const getRemoveVotePayload = (): VoteOnMultiSigActionPayload => {
    handleLoadingChange(true);

    const {
      multiSigData: { nativeMultiSigId, nativeMultiSigDomainId },
    } = action;

    return {
      colonyAddress: colony.colonyAddress,
      colonyDomains: extractColonyDomains(colony.domains),
      colonyRoles: extractColonyRoles(colony.roles),
      vote: MultiSigVote.None,
      domainId: Number(nativeMultiSigDomainId),
      multiSigId: nativeMultiSigId,
      roles: requiredRoles,
      associatedActionId:
        action.expenditure?.creatingActions?.items[0]?.transactionHash ||
        action.transactionHash,
    };
  };

  return (
    <ActionButton
      loadingBehavior={LoadingBehavior.TxLoader}
      isFullSize
      actionType={ActionTypes.MULTISIG_VOTE}
      isLoading={isLoading}
      onError={() => {
        handleLoadingChange(false);
      }}
      values={getRemoveVotePayload}
    >
      {formatText(MSG.remove)}
    </ActionButton>
  );
};

RemoveVoteButton.displayName = displayName;
export default RemoveVoteButton;
