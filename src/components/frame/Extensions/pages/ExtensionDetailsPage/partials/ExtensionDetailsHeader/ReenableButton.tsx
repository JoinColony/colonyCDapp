import { Question } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { useMobile } from '~hooks/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/Modal.tsx';

import { ButtonWithLoader } from './ButtonWithLoader.tsx';
import { useReenable } from './hooks.tsx';

const displayName = 'pages.ExtensionDetailsPage.RenableButton';

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

  const {
    formState: { isSubmitting },
  } = useFormContext();

  const { isPendingManagement } = useExtensionDetailsPageContext();

  return (
    <>
      <ButtonWithLoader
        type="button"
        onClick={() => setIsReEnableModalOpen(true)}
        isFullSize={isMobile}
        loading={isLoading}
        disabled={isPendingManagement || isSubmitting}
      >
        {formatText({ id: 'button.enable' })}
      </ButtonWithLoader>
      <Modal
        icon={Question}
        title={formatText({ id: 'extensionReEnable.modal.title' })}
        subtitle={formatText({
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
