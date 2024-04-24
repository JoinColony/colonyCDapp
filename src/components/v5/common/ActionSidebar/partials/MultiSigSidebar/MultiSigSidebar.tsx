import { type FC } from 'react';
import React from 'react';

import useGetColonyAction from '../../hooks/useGetColonyAction.ts';

const displayName = 'v5.common.ActionSidebar.partials.MultiSig';
interface MultiSigSidebarProps {
  transactionId: string;
}
const MultiSigSidebar: FC<MultiSigSidebarProps> = ({ transactionId }) => {
  const { action, loadingAction } = useGetColonyAction(transactionId);

  if (loadingAction || !action) {
    return <div>Loading</div>;
  }

  return <div>MultiSig action</div>;
};

MultiSigSidebar.displayName = displayName;
export default MultiSigSidebar;
