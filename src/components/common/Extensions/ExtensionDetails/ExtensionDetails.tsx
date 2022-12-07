import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useExtensionData } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import NotFoundRoute from '~routes/NotFoundRoute';
import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes';
import { isInstalledExtensionData } from '~utils/extensions';

const displayName = 'common.Extensions.ExtensionDetails';

const MSG = defineMessages({
  unsupportedExtension: {
    id: `${displayName}.unsupportedExtension`,
    defaultMessage: 'This extension is not supported.',
  },
});

const ExtensionDetails = () => {
  const { extensionId } = useParams();

  const { extensionData, loading } = useExtensionData(extensionId ?? '');

  if (loading) {
    return <SpinnerLoader appearance={{ theme: 'primary', size: 'massive' }} />;
  }

  if (!extensionData) {
    return (
      <div>
        <FormattedMessage {...MSG.unsupportedExtension} />
      </div>
    );
  }

  return (
    <div>
      Extension Details{' '}
      <div>
        Extension installed:{' '}
        {isInstalledExtensionData(extensionData) ? 'yes' : 'no'}
      </div>
      <div>Available version: {extensionData.availableVersion}</div>
      <Routes>
        <Route path="/" element={<div>Details</div>} />
        <Route path={COLONY_EXTENSION_SETUP_ROUTE} element={<div>Setup</div>} />

        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
