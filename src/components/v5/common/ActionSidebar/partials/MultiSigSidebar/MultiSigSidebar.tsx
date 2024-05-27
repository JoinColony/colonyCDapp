import { type FC } from 'react';
import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { type MultiSigUserSignature } from '~gql';
import { notMaybe } from '~utils/arrays/index.ts';

import useGetColonyAction from '../../hooks/useGetColonyAction.ts';

import RemoveVoteButton from './partials/RemoveVoteButton/RemoveVoteButton.tsx';
import Signees from './partials/Signees/Signees.tsx';
import VoteButton from './partials/VoteButton/VoteButton.tsx';

const displayName = 'v5.common.ActionSidebar.partials.MultiSig';
interface MultiSigSidebarProps {
  transactionId: string;
}
const MultiSigSidebar: FC<MultiSigSidebarProps> = ({ transactionId }) => {
  const { user } = useAppContext();
  const { action, loadingAction } = useGetColonyAction(transactionId);

  if (loadingAction || !action) {
    return <div>Loading</div>;
  }

  if (!action.multiSigData || !action.multiSigId) {
    console.warn('Not a multisig action');
    return null;
  }

  // @TODO check why types are nagging me here
  const signatures = action.multiSigData?.signatures?.items ?? [];
  const userSignature = signatures.find(
    (signature) => signature?.userAddress === user?.walletAddress,
  );

  return (
    <div>
      <Signees
        signees={
          signatures.filter(notMaybe) as unknown as MultiSigUserSignature[]
        }
      />
      {userSignature ? (
        <RemoveVoteButton
          actionType={action.type}
          multiSigColonyAddress={action.colonyAddress}
          multiSigId={action.multiSigData.nativeMultiSigId}
          multiSigDomainId={Number(action.multiSigData.nativeMultiSigDomainId)}
        />
      ) : (
        <VoteButton
          actionType={action.type}
          multiSigColonyAddress={action.colonyAddress}
          multiSigId={action.multiSigData.nativeMultiSigId}
          multiSigDomainId={Number(action.multiSigData.nativeMultiSigDomainId)}
        />
      )}
    </div>
  );
};

MultiSigSidebar.displayName = displayName;
export default MultiSigSidebar;
