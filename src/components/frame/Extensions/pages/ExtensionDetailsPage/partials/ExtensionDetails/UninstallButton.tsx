import React, { useState } from 'react';

import { AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/Checkbox.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

import { useUninstall } from './hooks.tsx';

const displayName = 'pages.ExtensionDetailsPage.UninstallButton';

const UninstallButton = ({
  extensionData: { extensionId },
}: {
  extensionData: AnyExtensionData;
}) => {
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const { handleUninstall, isLoading } = useUninstall({
    extensionId,
  });

  return (
    <>
      <div className="flex justify-center w-full">
        <Button
          mode="primaryOutlineFull"
          size="small"
          isFullSize
          loading={isLoading}
          onClick={() => setIsUninstallModalOpen(true)}
        >
          {formatText({ id: 'button.uninstallExtension' })}
        </Button>
      </div>

      <Modal
        isOpen={isUninstallModalOpen}
        icon="trash"
        isWarning
        onClose={() => {
          setIsCheckboxChecked(false);
          setIsUninstallModalOpen(false);
        }}
        onConfirm={handleUninstall}
        title={formatText({
          id: 'extensionDetailsPage.uninstallTitle',
        })}
        subTitle={formatText({
          id: 'extensionDetailsPage.uninstallDescription',
        })}
        confirmMessage={formatText({
          id: 'button.confirmUninstall',
        })}
        closeMessage={formatText({
          id: 'button.cancelUninstall',
        })}
        disabled={!isCheckboxChecked}
      >
        <div className="rounded-md border bg-negative-100 border-negative-400 p-4 text-negative-400 mt-6">
          <ul className="text-sm list-disc pl-4">
            <li>
              {formatText({
                id: 'extensionDetailsPage.uninstallBoxOne',
              })}
            </li>
            <li>
              {formatText({
                id: 'extensionDetailsPage.uninstallBoxTwo',
              })}
            </li>
          </ul>
        </div>
        <Checkbox
          name="uninstall"
          id="uninstall"
          label={{ id: 'extensionDetailsPage.uninstallConfirmation' }}
          isChecked={isCheckboxChecked}
          onChange={() => setIsCheckboxChecked((prevState) => !prevState)}
          classNames="mt-5"
        />
      </Modal>
    </>
  );
};

UninstallButton.displayName = displayName;

export default UninstallButton;
