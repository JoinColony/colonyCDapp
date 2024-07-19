import { Question, SpinnerGap } from '@phosphor-icons/react';
import React, { useState } from 'react';

import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

import { useDeprecate } from './hooks.tsx';

interface DeprecateButtonProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionDetailsPage.DeprecateButton';

const DeprecateButton = ({
  extensionData: { extensionId },
}: DeprecateButtonProps) => {
  const [isDeprecateModalOpen, setIsDeprecateModalOpen] = useState(false);

  const { handleDeprecate, isLoading } = useDeprecate({
    extensionId,
  });

  return (
    <>
      <div className="flex w-full justify-center">
        {isLoading ? (
          <TxButton
            rounded="s"
            isFullSize
            text={{ id: 'button.pending' }}
            icon={
              <span className="ml-2 flex shrink-0">
                <SpinnerGap size={14} className="animate-spin" />
              </span>
            }
            className="!px-4 !py-2 !text-sm"
          />
        ) : (
          <Button
            mode="primaryOutlineFull"
            size="small"
            isFullSize
            loading={isLoading}
            onClick={() => setIsDeprecateModalOpen(true)}
          >
            {formatText({ id: 'button.deprecateExtension' })}
          </Button>
        )}
      </div>
      <Modal
        isOpen={isDeprecateModalOpen}
        icon={Question}
        onClose={() => setIsDeprecateModalOpen(false)}
        title={formatText({ id: 'extensionDetailsPage.deprecate' })}
        subTitle={formatText({
          id: 'extensionDetailsPage.deprecateDescription',
        })}
        onConfirm={handleDeprecate}
        confirmMessage={formatText({
          id: 'button.deprecateExtension',
        })}
        closeMessage={formatText({ id: 'button.cancel' })}
        buttonMode="primarySolid"
      >
        <p className="mt-6 text-md text-gray-600">
          {formatText({ id: 'extensionDetailsPage.confirmation' })}
        </p>
      </Modal>
    </>
  );
};

DeprecateButton.displayName = displayName;

export default DeprecateButton;
