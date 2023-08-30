import React, { useState } from 'react';

import { AnyExtensionData } from '~types';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button/Button';
import Modal from '~v5/shared/Modal/Modal';
import { useEnable } from './hooks';

const displayName = 'pages.ExtensionDetailsPage.EnableButton';

const EnableButton = ({
  extensionData: { extensionId },
}: {
  extensionData: AnyExtensionData;
}) => {
  const [isReEnableModalOpen, setIsReEnableModalOpen] = useState(false);
  const { handleEnable, isLoading } = useEnable({
    extensionId,
  });
  return (
    <div className="flex justify-center w-full">
      <Button
        mode="primaryOutlineFull"
        size="small"
        isFullSize
        loading={isLoading}
        onClick={() => setIsReEnableModalOpen(true)}
      >
        {formatText({ id: 'button.enable' })}
      </Button>
      <Modal
        title={formatText({ id: 'extensionReEnable.modal.title' })}
        subTitle={formatText({
          id: 'extensionReEnable.modal.subTitle',
        })}
        isOpen={isReEnableModalOpen}
        onClose={() => setIsReEnableModalOpen(false)}
        onConfirm={handleEnable}
        confirmMessage={formatText({ id: 'button.confirm' })}
        closeMessage={formatText({
          id: 'button.cancel',
        })}
      />
    </div>
  );
};

EnableButton.displayName = displayName;

export default EnableButton;
