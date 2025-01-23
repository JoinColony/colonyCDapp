import { Extension } from '@colony/colony-js';
import React, { type FC } from 'react';

import useExtensionData from '~hooks/useExtensionData.ts';
import { type MultiSigAction } from '~types/motions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import MultiSigWidget from '~v5/common/ActionSidebar/partials/MultiSigSidebar/partials/MultiSigWidget/MultiSigWidget.tsx';
import UninstalledMessage from '~v5/common/UninstalledMessage/UninstalledMessage.tsx';
import MotionWidgetSkeleton from '~v5/shared/MotionWidgetSkeleton/MotionWidgetSkeleton.tsx';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilderWidget.partials.MultiSigFunding';

interface MultiSigFundingProps {
  action: MultiSigAction;
  onMultiSigRejected?: () => void;
}

const MultiSigFunding: FC<MultiSigFundingProps> = ({
  action,
  onMultiSigRejected,
}) => {
  const { extensionData, loading } = useExtensionData(
    Extension.MultisigPermissions,
  );

  const isMultiSigExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  if (loading) {
    return <MotionWidgetSkeleton />;
  }

  if (!isMultiSigExtensionInstalled) {
    return <UninstalledMessage extension={Extension.MultisigPermissions} />;
  }

  return (
    <MultiSigWidget
      action={action}
      variant="standalone"
      onMultiSigRejected={onMultiSigRejected}
    />
  );
};

MultiSigFunding.displayName = displayName;
export default MultiSigFunding;
