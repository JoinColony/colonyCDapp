import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext, useExtensionData } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import NotFoundRoute from '~routes/NotFoundRoute';
import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes';
import { isInstalledExtensionData } from '~utils/extensions';
import { DialogActionButton } from '~shared/Button';
import { ConfirmDialog } from '~shared/Dialog';
import { ActionTypes } from '~redux';

import ExtensionActionButton from '../ExtensionActionButton';

const displayName = 'common.Extensions.ExtensionDetails';

const MSG = defineMessages({
  unsupportedExtension: {
    id: `${displayName}.unsupportedExtension`,
    defaultMessage: 'This extension is not supported.',
  },
  buttonUninstall: {
    id: `${displayName}.buttonUninstall`,
    defaultMessage: 'Uninstall',
  },
});

const ExtensionDetails = () => {
  const { extensionId } = useParams();
  const { colony } = useColonyContext();
  const { extensionData, loading } = useExtensionData(extensionId ?? '');

  if (loading) {
    return <SpinnerLoader appearance={{ theme: 'primary', size: 'massive' }} />;
  }

  if (!colony) {
    return null;
  }

  if (!extensionData) {
    return (
      <div>
        <FormattedMessage {...MSG.unsupportedExtension} />
      </div>
    );
  }

  // @TODO: Extend this check to include permissions, account and network interaction
  const canExtensionBeUninstalled =
    isInstalledExtensionData(extensionData) && extensionData.uninstallable;

  return (
    <div>
      Extension Details{' '}
      <div>
        Extension installed:{' '}
        {isInstalledExtensionData(extensionData) ? 'yes' : 'no'}
      </div>
      <div>Available version: {extensionData.availableVersion}</div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div>
                Details of <FormattedMessage {...extensionData.name} />
              </div>

              <ExtensionActionButton extensionData={extensionData} />
              {canExtensionBeUninstalled && (
                <DialogActionButton
                  dialog={ConfirmDialog}
                  submit={ActionTypes.EXTENSION_UNINSTALL}
                  error={ActionTypes.EXTENSION_UNINSTALL_ERROR}
                  success={ActionTypes.EXTENSION_UNINSTALL_SUCCESS}
                  values={{ colonyAddress: colony.colonyAddress, extensionId }}
                  text={MSG.buttonUninstall}
                />
              )}
            </div>
          }
        />
        <Route path={COLONY_EXTENSION_SETUP_ROUTE} element={<div>Setup</div>} />

        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
