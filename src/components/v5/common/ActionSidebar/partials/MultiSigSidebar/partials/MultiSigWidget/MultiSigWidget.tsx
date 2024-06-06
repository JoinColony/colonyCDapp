import { type FC } from 'react';
import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import {
  type ColonyActionType,
  type MultiSigUserSignatureFragment,
  type ColonyMultiSigFragment,
  MultiSigVote,
} from '~gql';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
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
  multiSigData: ColonyMultiSigFragment;
}

const MultiSigWidget: FC<MultiSigWidgetProps> = ({
  multiSigData,
  actionType,
}) => {
  const { user } = useAppContext();
  const requiredRole = getMultiSigRequiredRole(actionType);

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

  const isMultiSigFinalizable =
    signatures.filter((signature) => signature.vote === MultiSigVote.Approve)
      .length >= threshold;
  const isMultiSigCancelable =
    signatures.filter((signature) => signature.vote === MultiSigVote.Reject)
      .length >= threshold;
  const isMultiSigRejected = multiSigData.isRejected;
  const isMultiSigExecuted = multiSigData.isExecuted;
  const isMultiSigExecutedSuccessfully = multiSigData.isSuccess;

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
      <span>Threshold: {threshold}</span>
      <Signees
        signees={signatures as unknown as MultiSigUserSignatureFragment[]}
      />
      {userSignature ? (
        <RemoveVoteButton
          actionType={actionType}
          multiSigId={multiSigData.nativeMultiSigId}
          multiSigDomainId={Number(multiSigData.nativeMultiSigDomainId)}
        />
      ) : (
        <>
          <VoteButton
            actionType={actionType}
            multiSigId={multiSigData.nativeMultiSigId}
            multiSigDomainId={Number(multiSigData.nativeMultiSigDomainId)}
          />
          <RejectButton
            actionType={actionType}
            multiSigId={multiSigData.nativeMultiSigId}
            multiSigDomainId={Number(multiSigData.nativeMultiSigDomainId)}
          />
        </>
      )}
      {isMultiSigFinalizable && (
        <FinalizeButton multiSigId={multiSigData.nativeMultiSigId} />
      )}
      {isMultiSigCancelable && (
        <CancelButton multiSigId={multiSigData.nativeMultiSigId} />
      )}
    </div>
  );
};

MultiSigWidget.displayName = displayName;
export default MultiSigWidget;
