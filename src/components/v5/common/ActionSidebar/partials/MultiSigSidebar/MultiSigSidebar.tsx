import { type FC } from 'react';
import React from 'react';

import useGetColonyAction from '../../hooks/useGetColonyAction.ts';

import Signees from './partials/Signees/Signees.tsx';
import VoteButton from './partials/VoteButton/VoteButton.tsx';

const displayName = 'v5.common.ActionSidebar.partials.MultiSig';
interface MultiSigSidebarProps {
  transactionId: string;
}
const MultiSigSidebar: FC<MultiSigSidebarProps> = ({ transactionId }) => {
  const { action, loadingAction } = useGetColonyAction(transactionId);

  if (loadingAction || !action) {
    return <div>Loading</div>;
  }

  if (!action.multiSigData || !action.multiSigId) {
    console.warn('Not a multisig action');
    return null;
  }

  return (
    <div>
      <Signees signees={[]} />
      <VoteButton
        actionType={action.type}
        multiSigColonyAddress={action.colonyAddress}
        multiSigId={action.multiSigData.nativeMultiSigId}
        multiSigDomainId={Number(action.multiSigData.nativeMultiSigDomainId)}
      />
    </div>
  );
};

MultiSigSidebar.displayName = displayName;
export default MultiSigSidebar;
