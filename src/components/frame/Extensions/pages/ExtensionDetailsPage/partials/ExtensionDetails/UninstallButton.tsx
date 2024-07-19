import { SpinnerGap, Trash } from '@phosphor-icons/react';
import React, { useState } from 'react';

import { type AnyExtensionData } from '~types/extensions.ts';
import { formatText } from '~utils/intl.ts';
import Checkbox from '~v5/common/Checkbox/Checkbox.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';
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
            onClick={() => setIsUninstallModalOpen(true)}
          >
            {formatText({ id: 'button.uninstallExtension' })}
          </Button>
        )}
      </div>

      <Modal
        isOpen={isUninstallModalOpen}
        icon={Trash}
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
        <div className="mt-6 rounded-md border border-negative-400 bg-negative-100 p-4 text-negative-400">
          <ul className="list-disc pl-4 text-sm">
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
