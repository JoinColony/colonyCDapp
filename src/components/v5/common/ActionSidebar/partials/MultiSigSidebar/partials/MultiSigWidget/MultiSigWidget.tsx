import { type FC } from 'react';
import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useCompletedActionContext } from '~context/CompletedActionContext/CompletedActionContext.ts';
import { type ColonyActionType, MultiSigVote } from '~gql';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import {
  type MultiSigUserSignature,
  type ColonyMultiSig,
} from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { getRolesNeededForMultiSigAction } from '~utils/multiSig.ts';

import CancelButton from '../CancelButton/CancelButton.tsx';
import FinalizeButton from '../FinalizeButton/FinalizeButton.tsx';
import RemoveVoteButton from '../RemoveVoteButton/RemoveVoteButton.tsx';
import Signees from '../Signees/Signees.tsx';
import VoteButton from '../VoteButton/VoteButton.tsx';

const displayName =
  'v5.common.ActionSidebar.partials.MultiSig.partials.MultiSigWidget';

interface MultiSigWidgetProps {
  actionType: ColonyActionType;
  multiSigData: ColonyMultiSig;
}

const MultiSigWidget: FC<MultiSigWidgetProps> = ({
  multiSigData,
  actionType,
}) => {
  const { user } = useAppContext();
  const requiredRoles = getRolesNeededForMultiSigAction(actionType);
  const { showRejectMultiSigStep, setShowRejectMultiSigStep } =
    useCompletedActionContext();

  const { isLoading, thresholdPerRole } = useDomainThreshold({
    domainId: Number(multiSigData.multiSigDomainId),
    requiredRoles,
  });

  if (isLoading) {
    return <div>Loading threshold</div>;
  }

  if (thresholdPerRole === null) {
    console.warn('Invalid threshold');
    return <div>Invalid threshold, assign some stuff</div>;
  }

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);
  const userSignature = signatures.find(
    (signature) => signature?.userAddress === user?.walletAddress,
  );

  const approvalSignaturesPerRole = {};
  const rejectionSignaturesPerRole = {};
  const allApprovalSignees = new Set<MultiSigUserSignature['user']>();
  const allRejectionSignees = new Set<MultiSigUserSignature['user']>();

  signatures.forEach((signature) => {
    const { role, vote, user: voter } = signature;

    if (vote === 'Approve') {
      allApprovalSignees.add(voter);

      if (!approvalSignaturesPerRole[role]) {
        approvalSignaturesPerRole[role] = [];
      }
      approvalSignaturesPerRole[role].push(signature);
    } else if (vote === 'Reject') {
      allRejectionSignees.add(voter);

      if (!rejectionSignaturesPerRole[role]) {
        rejectionSignaturesPerRole[role] = [];
      }
      rejectionSignaturesPerRole[role].push(signature);
    }
  });

  const isMultiSigFinalizable = Object.keys(approvalSignaturesPerRole).every(
    (role) => {
      const approvals = approvalSignaturesPerRole[role]?.length || 0;
      const threshold = thresholdPerRole[role] || 0;
      return approvals >= threshold;
    },
  );

  const isMultiSigCancelable = Object.keys(rejectionSignaturesPerRole).every(
    (role) => {
      const approvals = approvalSignaturesPerRole[role]?.length || 0;
      const threshold = thresholdPerRole[role] || 0;
      return approvals >= threshold;
    },
  );

  const isMultiSigRejected = multiSigData.isRejected;
  const isMultiSigExecuted = multiSigData.isExecuted;

  if (Object.keys(rejectionSignaturesPerRole).length > 0) {
    setShowRejectMultiSigStep(true);
  }

  if (isMultiSigRejected) {
    return <div>MultiSig motion rejected</div>;
  }

  if (isMultiSigExecuted) {
    return <div>MultiSig motion completed</div>;
  }

  const combinedThreshold = Object.values(thresholdPerRole).reduce(
    (acc, threshold) => acc + threshold,
    0,
  );

  let combinedApprovals = 0;
  Object.keys(approvalSignaturesPerRole).forEach((role) => {
    const approvalsForRole = approvalSignaturesPerRole[role]
      ? approvalSignaturesPerRole[role].length
      : 0;
    const thresholdForRole = thresholdPerRole[role];
    combinedApprovals += Math.min(approvalsForRole, thresholdForRole);
  });

  let combinedRejections = 0;
  Object.keys(approvalSignaturesPerRole).forEach((role) => {
    const rejectionsForRole = rejectionSignaturesPerRole[role]
      ? rejectionSignaturesPerRole[role].length
      : 0;
    const thresholdForRole = thresholdPerRole[role];
    combinedRejections += Math.min(rejectionsForRole, thresholdForRole);
  });

  return (
    <div>
      <span>
        Approvals: {combinedApprovals} of {combinedThreshold}
      </span>
      <Signees signees={Array.from(allApprovalSignees)} />
      {userSignature?.vote === MultiSigVote.Approve ? (
        <RemoveVoteButton
          actionType={actionType}
          multiSigId={multiSigData.nativeMultiSigId}
          multiSigDomainId={Number(multiSigData.nativeMultiSigDomainId)}
        />
      ) : (
        <VoteButton
          actionType={actionType}
          multiSigId={multiSigData.nativeMultiSigId}
          multiSigDomainId={Number(multiSigData.nativeMultiSigDomainId)}
          voteType={MultiSigVote.Approve}
        />
      )}
      {isMultiSigFinalizable && (
        <FinalizeButton multiSigId={multiSigData.nativeMultiSigId} />
      )}
      {showRejectMultiSigStep ? (
        <>
          {' '}
          <span>
            Rejections: {combinedRejections} of {combinedThreshold}
          </span>
          <Signees signees={Array.from(allRejectionSignees)} />
          {userSignature?.vote === MultiSigVote.Reject ? (
            <RemoveVoteButton
              actionType={actionType}
              multiSigId={multiSigData.nativeMultiSigId}
              multiSigDomainId={Number(multiSigData.nativeMultiSigDomainId)}
            />
          ) : (
            <VoteButton
              actionType={actionType}
              multiSigId={multiSigData.nativeMultiSigId}
              multiSigDomainId={Number(multiSigData.nativeMultiSigDomainId)}
              voteType={MultiSigVote.Reject}
            />
          )}
        </>
      ) : null}
      {isMultiSigCancelable && (
        <CancelButton multiSigId={multiSigData.nativeMultiSigId} />
      )}
    </div>
  );
};

MultiSigWidget.displayName = displayName;
export default MultiSigWidget;
