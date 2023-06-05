import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { ExtensionDetailsProps } from './types';
import SpecificSidePanel from '~common/Extensions/SpecificSidePanel/SpecificSidePanel';
import Button from '~shared/Extensions/Button';
import { useExtensionDetails } from './hooks';

const displayName = 'frame.Extensions.pages.ExtensionDetailsPage.partials.ExtensionDetails';

const ExtensionDetails: FC<ExtensionDetailsProps> = ({ extensionData, canBeDeprecated, canBeUninstalled }) => {
  const { formatMessage } = useIntl();
  const { sidePanelData, status } = useExtensionDetails(extensionData);

  return (
    <div>
      <SpecificSidePanel statuses={status} sidePanelData={sidePanelData} />
      {/* @TODO: Add functionality and modals to deprecate and uninstall extension */}
      {canBeDeprecated && (
        <div className="mt-6">
          <Button mode="primaryOutline" isFullSize>
            {formatMessage({ id: 'extensionDetailsPage.deprecate' })}
          </Button>
        </div>
      )}
      {canBeUninstalled && (
        <div className="mt-6">
          <Button mode="primaryOutline" isFullSize>
            {formatMessage({ id: 'extensionDetailsPage.uninstall' })}
          </Button>
        </div>
      )}
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
