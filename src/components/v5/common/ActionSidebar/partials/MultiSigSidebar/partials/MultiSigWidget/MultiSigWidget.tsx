import { type FC } from 'react';
import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useCompletedActionContext } from '~context/CompletedActionContext/CompletedActionContext.ts';
import { type ColonyActionType, MultiSigVote } from '~gql';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { type ColonyMultiSig } from '~types/graphql.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { getMultiSigRequiredRole } from '~utils/multiSig.ts';

import CancelButton from '../CancelButton/CancelButton.tsx';
import FinalizeButton from '../FinalizeButton/FinalizeButton.tsx';
import RejectButton from '../RejectButton/RejectButton.tsx';
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
  const requiredRole = getMultiSigRequiredRole(actionType);
  const { showRejectMultiSigStep, setShowRejectMultiSigStep } =
    useCompletedActionContext();

  const { isLoading, threshold } = useDomainThreshold({
    domainId: multiSigData.multiSigDomainId,
    requiredRole,
  });

  if (isLoading) {
    return <div>Loading threshold</div>;
  }

  if (threshold === null) {
    console.warn('Invalid threshold');
    return <div>Invalid threshold, assign some stuff</div>;
  }

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);
  const userSignature = signatures.find(
    (signature) => signature?.userAddress === user?.walletAddress,
  );

  const approvalSignatures = signatures.filter(
    (signature) => signature.vote === MultiSigVote.Approve,
  );
  const rejectionSignatures = signatures.filter(
    (signature) => signature.vote === MultiSigVote.Reject,
  );

  const isMultiSigFinalizable = approvalSignatures.length >= threshold;
  const isMultiSigCancelable = rejectionSignatures.length >= threshold;
  const isMultiSigRejected = multiSigData.isRejected;
  const isMultiSigExecuted = multiSigData.isExecuted;
  const isMultiSigExecutedSuccessfully = multiSigData.isSuccess;

  if (rejectionSignatures.length > 0) {
    setShowRejectMultiSigStep(true);
  }

  if (isMultiSigRejected) {
    return <div>MultiSig motion rejected</div>;
  }

  if (isMultiSigExecuted) {
    return (
      <div>
        MultiSig motion completed{' '}
        {isMultiSigExecutedSuccessfully ? 'successfully' : 'unsuccessfully'}
      </div>
    );
  }

  return (
    <div>
      <span>
        Approvals: {approvalSignatures.length} of {threshold}
      </span>
      <Signees signees={approvalSignatures} />
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
            Rejections: {rejectionSignatures.length} of {threshold}
          </span>
          <Signees signees={rejectionSignatures} />
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
