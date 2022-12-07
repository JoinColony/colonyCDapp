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
  headingUninstall: {
    id: `${displayName}.headingUninstall`,
    defaultMessage: 'Uninstall extension',
  },
  textUninstall: {
    id: `${displayName}.textUninstall`,
    defaultMessage: `This extension is currently deprecated, and may be uninstalled. Doing so will remove it from the colony and any processes requiring it will no longer work. Are you sure you wish to proceed?`,
  },
  buttonDeprecate: {
    id: `${displayName}.buttonDeprecate`,
    defaultMessage: 'Deprecate',
  },
  headingDeprecate: {
    id: `${displayName}.headingDeprecate`,
    defaultMessage: 'Deprecate extension',
  },
  textDeprecate: {
    id: `${displayName}.textDeprecate`,
    defaultMessage: `This extension must first be deprecated if you wish to uninstall it. After deprecation, any actions using this extension already ongoing may be completed, but it will no longer be possible to create new actions requiring this extension. Are you sure you wish to proceed?`,
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

  // @TODO: Extend these checks to include permissions, account and network interaction
  const canExtensionBeUninstalled =
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    extensionData.isDeprecated;
  const canExtensionBeDeprecated =
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    !extensionData.isDeprecated;

  return (
    <div>
      Extension Details{' '}
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div>
                Details of <FormattedMessage {...extensionData.name} />
                <br />
                {isInstalledExtensionData(extensionData) ? (
                  <>
                    <div>Status: {extensionData.status}</div>
                    <div>
                      Is Deprecated: {extensionData.isDeprecated ? 'yes' : 'no'}
                    </div>
                    <div>Version: {extensionData.version}</div>
                  </>
                ) : (
                  <div>This extension is not installed</div>
                )}
              </div>

              <ExtensionActionButton extensionData={extensionData} />
              {canExtensionBeDeprecated && (
                <DialogActionButton
                  dialog={ConfirmDialog}
                  dialogProps={{
                    heading: MSG.headingDeprecate,
                    children: <FormattedMessage {...MSG.textDeprecate} />,
                  }}
                  appearance={{ theme: 'blue' }}
                  submit={ActionTypes.EXTENSION_DEPRECATE}
                  error={ActionTypes.EXTENSION_DEPRECATE_ERROR}
                  success={ActionTypes.EXTENSION_DEPRECATE_SUCCESS}
                  text={MSG.buttonDeprecate}
                  values={{
                    colonyAddress: colony.colonyAddress,
                    extensionId,
                    isToDeprecate: true,
                  }}
                />
              )}
              {canExtensionBeUninstalled && (
                <DialogActionButton
                  dialog={ConfirmDialog}
                  dialogProps={{
                    heading: MSG.headingUninstall,
                    children: <FormattedMessage {...MSG.textUninstall} />,
                  }}
                  appearance={{ theme: 'blue' }}
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
