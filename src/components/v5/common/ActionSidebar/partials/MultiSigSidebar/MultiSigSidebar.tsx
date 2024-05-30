import { type FC } from 'react';
import React from 'react';

import { type ColonyMultiSig } from '~gql';

import useGetColonyAction from '../../hooks/useGetColonyAction.ts';

import MultiSigWidget from './partials/MultiSigWidget/MultiSigWidget.tsx';

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
      <MultiSigWidget
        multiSigData={action.multiSigData as unknown as ColonyMultiSig}
        actionType={action.type}
      />
    </div>
  );
};

MultiSigSidebar.displayName = displayName;
export default MultiSigSidebar;
