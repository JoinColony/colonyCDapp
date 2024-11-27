import { Extension } from '@colony/colony-js';
import { type FC } from 'react';
import React from 'react';

import useExtensionData from '~hooks/useExtensionData.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { isMultiSig } from '~utils/multiSig/index.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import UninstalledMessage from '~v5/common/UninstalledMessage/index.ts';

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

  if (!isMultiSig(action)) {
    console.warn('Not a multisig action');
    return null;
  }

  const isMultiSigExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  if (!isMultiSigExtensionInstalled) {
    return <UninstalledMessage extension={Extension.MultisigPermissions} />;
  }

  return (
    <div>
      <MultiSigWidget action={action} variant="stepper" />
    </div>
  );
};

MultiSigSidebar.displayName = displayName;
export default MultiSigSidebar;
