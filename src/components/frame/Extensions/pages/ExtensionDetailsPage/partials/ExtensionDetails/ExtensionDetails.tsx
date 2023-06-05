import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { ExtensionDetailsProps } from './types';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel/SpecificSidePanel';
import Button from '~shared/Extensions/Button';
import { useExtensionDetails } from './hooks';
import Modal from '~shared/Extensions/Modal';

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionDetails';

const ExtensionDetails: FC<ExtensionDetailsProps> = ({ extensionData, canBeDeprecated, canBeUninstalled }) => {
  const { formatMessage } = useIntl();
  const { sidePanelData, status, handleDeprecate } = useExtensionDetails(extensionData);
  const [isDeprecateModalOpen, setIsDeprecateModalOpen] = useState(false);

  return (
    <div>
      <SpecificSidePanel statuses={status} sidePanelData={sidePanelData} />
      {/* @TODO: Add functionality and modals to uninstall extension */}
      <div className="sm:w-[20.375rem]">
        {canBeDeprecated && (
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
                <Button mode="primarySolid" isFullSize onClick={handleDeprecate}>
                  {formatMessage({ id: 'extensionDetailsPage.deprecate' })}
                </Button>
              </div>
            </Modal>
          </div>
        )}
        {/* @TODO: Add functionality and modals to uninstall extension */}
        {canBeUninstalled && (
          <div className="mt-6">
            <Button mode="primaryOutline" isFullSize>
              {formatMessage({ id: 'extensionDetailsPage.uninstall' })}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
