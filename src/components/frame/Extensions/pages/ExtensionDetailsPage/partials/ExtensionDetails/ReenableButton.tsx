import React, { useState } from 'react';

import { AnyExtensionData } from '~types';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button/Button';
import Modal from '~v5/shared/Modal/Modal';
import { useReenable } from './hooks';

const displayName = 'pages.ExtensionDetailsPage.ReenableButton';

const ReenableButton = ({
  extensionData: { extensionId },
}: {
  extensionData: AnyExtensionData;
}) => {
  const [isReEnableModalOpen, setIsReEnableModalOpen] = useState(false);
  const { handleReEnable, isLoading } = useReenable({
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
        {formatText({ id: 'button.reEnable' })}
      </Button>
      <Modal
        title={formatText({ id: 'extensionReEnable.modal.title' })}
        subTitle={formatText({
          id: 'extensionReEnable.modal.subTitle',
        })}
        isOpen={isReEnableModalOpen}
        onClose={() => setIsReEnableModalOpen(false)}
        onConfirm={handleReEnable}
        confirmMessage={formatText({ id: 'button.confirm' })}
        closeMessage={formatText({
          id: 'button.cancel',
        })}
      />
    </div>
  );
};

ReenableButton.displayName = displayName;

export default ReenableButton;
