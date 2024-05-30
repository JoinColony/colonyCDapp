import { type FC } from 'react';
import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import {
  type ColonyMultiSig,
  type ColonyActionType,
  type MultiSigUserSignatureFragment,
} from '~gql';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { notMaybe } from '~utils/arrays/index.ts';
import { getMultiSigRequiredRole } from '~utils/multiSig.ts';

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

  const { isLoading, threshold } = useDomainThreshold({
    domainId: multiSigData.multiSigDomainId,
    requiredRole,
  });

  if (isLoading) {
    return <div>Loading threshold</div>;
  }

  const signatures = (multiSigData?.signatures?.items ?? []).filter(notMaybe);
  const userSignature = signatures.find(
    (signature) => signature?.userAddress === user?.walletAddress,
  );

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
        <VoteButton
          actionType={actionType}
          multiSigId={multiSigData.nativeMultiSigId}
          multiSigDomainId={Number(multiSigData.nativeMultiSigDomainId)}
        />
      )}
    </div>
  );
};

MultiSigWidget.displayName = displayName;
export default MultiSigWidget;
