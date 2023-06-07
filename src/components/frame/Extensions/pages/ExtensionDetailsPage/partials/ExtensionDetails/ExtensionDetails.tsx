import React, { FC, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ExtensionDetailsProps } from './types';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel/SpecificSidePanel';
import Button from '~shared/Extensions/Button';
import { useExtensionDetails } from './hooks';
import Modal from '~shared/Extensions/Modal';
import Checkbox from '~common/Extensions/Checkbox';

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionDetails';

const ExtensionDetails: FC<ExtensionDetailsProps> = ({ extensionData }) => {
  const { formatMessage } = useIntl();
  const { canExtensionBeUninstalled, canExtensionBeDeprecated, handleDeprecate, handleUninstall } =
    useExtensionDetails(extensionData);
  const [isDeprecateModalOpen, setIsDeprecateModalOpen] = useState(false);
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);
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
          <Button mode="primaryOutline" isFullSize onClick={() => setIsDeprecateModalOpen(true)}>
            {formatMessage({ id: 'extensionDetailsPage.deprecate' })}
          </Button>
          <Modal isOpen={isDeprecateModalOpen} icon="question" onClose={() => setIsDeprecateModalOpen(false)}>
            <h4 className="text-lg font-semibold mb-2">{formatMessage({ id: 'extensionDetailsPage.deprecate' })}</h4>
            <p className="text-gray-600 text-md">
              {formatMessage({ id: 'extensionDetailsPage.deprecateDescription' })}
            </p>
            <p className="text-gray-600 text-md mt-6">{formatMessage({ id: 'extensionDetailsPage.confirmation' })}</p>
            <div className="flex gap-3 mt-8">
              <Button mode="primaryOutline" isFullSize onClick={() => setIsDeprecateModalOpen(false)}>
                {formatMessage({ id: 'extensionDetailsPage.cancel' })}
              </Button>
              <Button
                mode="primarySolid"
                isFullSize
                onClick={() => {
                  handleDeprecate();
                  setIsDeprecateModalOpen(false);
                }}
              >
                {formatMessage({ id: 'extensionDetailsPage.deprecate' })}
              </Button>
            </div>
          </Modal>
        </div>
      )}
      {canExtensionBeUninstalled && (
        <div className="mt-6">
          <Button mode="primaryOutline" isFullSize onClick={() => setIsUninstallModalOpen(true)}>
            {formatMessage({ id: 'extensionDetailsPage.uninstall' })}
          </Button>
          <Modal isOpen={isUninstallModalOpen} icon="trash" isWarning onClose={() => setIsUninstallModalOpen(false)}>
            <h4 className="text-lg font-semibold mb-2">
              {formatMessage({ id: 'extensionDetailsPage.uninstallTitle' })}
            </h4>
            <p className="text-gray-600 text-md">
              {formatMessage({ id: 'extensionDetailsPage.uninstallDescription' })}
            </p>
            <div className="rounded-md border bg-negative-100 border-negative-400 p-4 text-negative-400 mt-6">
              <ul className="text-sm list-disc pl-4">
                <li>{formatMessage({ id: 'extensionDetailsPage.uninstallBoxOne' })}</li>
                <li>{formatMessage({ id: 'extensionDetailsPage.uninstallBoxTwo' })}</li>
              </ul>
            </div>
            <Checkbox
              name="uninstall"
              id="uninstall"
              label={{ id: 'extensionDetailsPage.uninstallConfirmation' }}
              onChange={() => setIsCheckboxChecked((prevState) => !prevState)}
              classNames="mt-5"
            />
            <div className="flex gap-3 mt-8">
              <Button mode="primaryOutline" isFullSize onClick={() => setIsUninstallModalOpen(false)}>
                {formatMessage({ id: 'extensionDetailsPage.cancelUninstall' })}
              </Button>
              <Button
                mode="secondarySolid"
                isFullSize
                disabled={!isCheckboxChecked}
                onClick={() => {
                  handleUninstall();
                  setIsUninstallModalOpen(false);
                }}
              >
                {formatMessage({ id: 'extensionDetailsPage.confirmUninstall' })}
              </Button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
