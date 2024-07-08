import { Extension } from '@colony/colony-js';
import { type FC } from 'react';
import React from 'react';

import useExtensionData from '~hooks/useExtensionData.ts';
import useGetColonyAction from '~hooks/useGetColonyAction.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { isMultiSig } from '~utils/multiSig/index.ts';
import UninstalledMessage from '~v5/common/UninstalledMessage/index.ts';

import ActionSidebarWidgetLoadingSkeleton from '../ActionSidebarWidgetLoadingSkeleton/ActionSidebarWidgetLoadingSkeleton.tsx';

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

  const isLoading = loadingAction || loadingExtension || !action;

  if (action && !isMultiSig(action)) {
    console.warn('Not a multisig action');

    return null;
  }

  if (isLoading) {
    return <ActionSidebarWidgetLoadingSkeleton />;
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
