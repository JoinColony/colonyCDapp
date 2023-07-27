import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ExtensionDetailsProps } from './types';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel';
import Button from '~v5/shared/Button';
import { useExtensionDetails } from './hooks';
import Modal from '~v5/shared/Modal';
import Checkbox from '~v5/common/Checkbox';

const displayName =
  'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionDetails';

const ExtensionDetails: FC<ExtensionDetailsProps> = ({ extensionData }) => {
  const { formatMessage } = useIntl();
  const {
    canExtensionBeUninstalled,
    canExtensionBeDeprecated,
    handleDeprecate,
    handleUninstall,
    handleReEnable,
  } = useExtensionDetails(extensionData);
  const [isDeprecateModalOpen, setIsDeprecateModalOpen] = useState(false);
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);
  const [isReEnableModalOpen, setIsReEnableModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  useEffect(() => {
    if (!isUninstallModalOpen) {
      setIsCheckboxChecked(false);
    }
  }, [isUninstallModalOpen]);

  return (
    <div>
      <SpecificSidePanel extensionData={extensionData} />
      {canExtensionBeDeprecated && (
        <div className="mt-6">
          <Button
            mode="primaryOutlineFull"
            size="small"
            isFullSize
            onClick={() => setIsDeprecateModalOpen(true)}
          >
            {formatMessage({ id: 'button.deprecateExtension' })}
          </Button>
          <Modal
            isOpen={isDeprecateModalOpen}
            icon="question"
            onClose={() => setIsDeprecateModalOpen(false)}
            title={formatMessage({ id: 'extensionDetailsPage.deprecate' })}
            subTitle={formatMessage({
              id: 'extensionDetailsPage.deprecateDescription',
            })}
            onConfirm={handleDeprecate}
            confirmMessage={formatMessage({
              id: 'button.deprecateExtension',
            })}
            closeMessage={formatMessage({ id: 'button.cancel' })}
            buttonMode="primarySolid"
          >
            <p className="text-gray-600 text-md mt-6">
              {formatMessage({ id: 'extensionDetailsPage.confirmation' })}
            </p>
          </Modal>
        </div>
      )}
      {canExtensionBeUninstalled && (
        <div className="mt-6 flex flex-col gap-4">
          <div>
            <Button
              mode="primaryOutlineFull"
              size="small"
              isFullSize
              onClick={() => setIsReEnableModalOpen(true)}
            >
              {formatMessage({ id: 'button.reEnable' })}
            </Button>
            <Modal
              title={formatMessage({ id: 'extensionReEnable.modal.title' })}
              subTitle={formatMessage({
                id: 'extensionReEnable.modal.subTitle',
              })}
              isOpen={isReEnableModalOpen}
              onClose={() => setIsReEnableModalOpen(false)}
              onConfirm={handleReEnable}
              confirmMessage={formatMessage({ id: 'button.confirm' })}
              closeMessage={formatMessage({
                id: 'button.cancel',
              })}
            />
          </div>
          <div>
            <Button
              mode="primaryOutlineFull"
              size="small"
              isFullSize
              onClick={() => setIsUninstallModalOpen(true)}
            >
              {formatMessage({ id: 'button.uninstallExtension' })}
            </Button>
            <Modal
              isOpen={isUninstallModalOpen}
              icon="trash"
              isWarning
              onClose={() => setIsUninstallModalOpen(false)}
              onConfirm={handleUninstall}
              title={formatMessage({
                id: 'extensionDetailsPage.uninstallTitle',
              })}
              subTitle={formatMessage({
                id: 'extensionDetailsPage.uninstallDescription',
              })}
              confirmMessage={formatMessage({
                id: 'button.confirmUninstall',
              })}
              closeMessage={formatMessage({
                id: 'button.cancelUninstall',
              })}
              disabled={!isCheckboxChecked}
            >
              <div className="rounded-md border bg-negative-100 border-negative-400 p-4 text-negative-400 mt-6">
                <ul className="text-sm list-disc pl-4">
                  <li>
                    {formatMessage({
                      id: 'extensionDetailsPage.uninstallBoxOne',
                    })}
                  </li>
                  <li>
                    {formatMessage({
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
          </div>
        </div>
      )}
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
