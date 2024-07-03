import { Extension } from '@colony/colony-js';
import { type FC } from 'react';
import React from 'react';

import useExtensionData from '~hooks/useExtensionData.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import useGetColonyAction from '../../hooks/useGetColonyAction.ts';

import MultiSigWidget from './partials/MultiSigWidget/MultiSigWidget.tsx';

const displayName = 'v5.common.ActionSidebar.partials.MultiSig';
interface MultiSigSidebarProps {
  transactionId: string;
}
const MultiSigSidebar: FC<MultiSigSidebarProps> = ({ transactionId }) => {
  const { action, loadingAction } = useGetColonyAction(transactionId);

  const { extensionData, loading: loadingExtension } = useExtensionData(
    Extension.MultisigPermissions,
  );

  if (loadingAction || loadingExtension || !action) {
    return <SpinnerLoader appearance={{ size: 'medium' }} />;
  }

  if (!action.multiSigData || !action.multiSigId) {
    console.warn('Not a multisig action');
    return null;
  }

  const isMultiSigExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  if (!isMultiSigExtensionInstalled) {
    return <div>The Multi Sig extension has been uninstalled</div>;
  }

  return (
    <div>
      <MultiSigWidget
        multiSigData={action.multiSigData}
        actionType={action.type}
        action={action}
        initiatorAddress={action.initiatorAddress}
      />
    </div>
  );
};

MultiSigSidebar.displayName = displayName;
export default MultiSigSidebar;
