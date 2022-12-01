import React from 'react';
import { getExtensionHash } from '@colony/colony-js';
import { Route, Routes, useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  useGetColonyExtensionQuery,
  useGetCurrentExtensionVersionQuery,
} from '~gql';
import { useColonyContext } from '~hooks';
import supportedExtensionsConfig from '~constants/extensions';
import { SpinnerLoader } from '~shared/Preloaders';
import NotFoundRoute from '~routes/NotFoundRoute';
import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes';

const displayName = 'common.ExtensionDetails';

const MSG = defineMessages({
  unsupportedExtension: {
    id: `${displayName}.unsupportedExtension`,
    defaultMessage: 'This extension is not supported.',
  },
});

const ExtensionDetails = () => {
  const { extensionId } = useParams();
  const extensionHash = getExtensionHash(extensionId ?? '');

  const { colony } = useColonyContext();

  const { data, loading } = useGetColonyExtensionQuery({
    variables: {
      colonyAddress: colony?.colonyAddress ?? '',
      extensionHash,
    },
    skip: !colony || !extensionId,
  });
  const installedExtension = data?.getExtensionByColonyAndHash?.items?.[0];

  const { data: versionData } = useGetCurrentExtensionVersionQuery({
    variables: {
      extensionHash,
    },
    skip: !extensionId,
  });
  const availableVersion =
    versionData?.getCurrentVersionByItem?.items?.[0]?.version;

  const extensionConfig = supportedExtensionsConfig.find(
    (c) => c.extensionId === extensionId,
  );

  if (loading) {
    return <SpinnerLoader appearance={{ theme: 'primary', size: 'massive' }} />;
  }

  if (!extensionConfig) {
    return (
      <div>
        <FormattedMessage {...MSG.unsupportedExtension} />
      </div>
    );
  }

  return (
    <div>
      Extension Details{' '}
      <div>Extension installed: {installedExtension ? 'yes' : 'no'}</div>
      <div>Available version: {availableVersion}</div>
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
