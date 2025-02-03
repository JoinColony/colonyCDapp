import { type ColonyRole } from '@colony/colony-js';
import React from 'react';
import { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { MultiSigVote } from '~gql';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type VoteOnMultiSigActionPayload } from '~redux/sagas/multiSig/voteOnMultiSig.ts';
import { getMotionAssociatedActionId } from '~utils/actions.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import { type ICompletedMultiSigAction } from '~v5/common/ActionSidebar/partials/MultiSigSidebar/types.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import { LoadingBehavior, type ButtonProps } from '~v5/shared/Button/types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.VoteButton';

interface VoteButtonProps extends ICompletedMultiSigAction {
  requiredRoles: ColonyRole[];
  voteType: Exclude<MultiSigVote, MultiSigVote.None>;
  handleLoadingChange: (isLoading: boolean) => void;
  isLoading: boolean;
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
  requiredRoles,
  voteType,
  buttonProps,
  handleLoadingChange,
  isLoading,
  action,
  multiSigData: { nativeMultiSigId, nativeMultiSigDomainId },
}) => {
  const { colony } = useColonyContext();

  const buttonText = {
    [MultiSigVote.Approve]: MSG.approve,
    [MultiSigVote.Reject]: MSG.reject,
  };

  const getVotePayload = (): VoteOnMultiSigActionPayload => {
    handleLoadingChange(true);

    const associatedActionId = getMotionAssociatedActionId(action);

    return {
      colonyAddress: colony.colonyAddress,
      colonyDomains: extractColonyDomains(colony.domains),
      colonyRoles: extractColonyRoles(colony.roles),
      vote: voteType,
      domainId: Number(nativeMultiSigDomainId),
      multiSigId: nativeMultiSigId,
      roles: requiredRoles,
      associatedActionId,
    };
  };

  return (
    <ActionButton
      isFullSize
      loadingBehavior={LoadingBehavior.TxLoader}
      actionType={ActionTypes.MULTISIG_VOTE}
      isLoading={isLoading}
      onError={() => {
        handleLoadingChange(false);
      }}
      values={getVotePayload}
      {...buttonProps}
    >
      {formatText(buttonText[voteType])}
    </ActionButton>
  );
};

VoteButton.displayName = displayName;
export default VoteButton;
