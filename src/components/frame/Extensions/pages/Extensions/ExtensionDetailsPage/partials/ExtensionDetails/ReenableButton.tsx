import React, { useState } from 'react';

import { useMobile } from '~hooks/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

import { useReenable } from './hooks.tsx';

const displayName =
  'frame.Extensions.pages.Extensions.ExtensionDetailsPage.partials.ExtensionDetails.RenableButton';

const ReenableButton = ({
  extensionData: { extensionId },
}: {
  extensionData: AnyExtensionData;
}) => {
  const [isReEnableModalOpen, setIsReEnableModalOpen] = useState(false);
  const { handleReenable, isLoading } = useReenable({
    extensionId,
  });
  const isMobile = useMobile();

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsReEnableModalOpen(true)}
        isFullSize={isMobile}
        loading={isLoading}
      >
        {formatText({ id: 'button.enable' })}
      </Button>
      <Modal
        title={formatText({ id: 'extensionReEnable.modal.title' })}
        subTitle={formatText({
          id: 'extensionReEnable.modal.subTitle',
        })}
        buttonMode="primarySolid"
        isOpen={isReEnableModalOpen}
        onClose={() => setIsReEnableModalOpen(false)}
        onConfirm={handleReenable}
        confirmMessage={formatText({ id: 'button.confirm' })}
        closeMessage={formatText({
          id: 'button.cancel',
        })}
      />
    </>
  );
};

ReenableButton.displayName = displayName;

export default ReenableButton;
