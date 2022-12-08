import React from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext, useExtensionData } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import NotFoundRoute from '~routes/NotFoundRoute';
import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes';
import { isInstalledExtensionData } from '~utils/extensions';
import BreadCrumb, { Crumb } from '~shared/BreadCrumb';

import ExtensionDetailsAside from './ExtensionDetailsAside';

import styles from './ExtensionDetails.css';
import Heading from '~shared/Heading';

const displayName = 'common.Extensions.ExtensionDetails';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Extensions',
  },
  unsupportedExtension: {
    id: `${displayName}.unsupportedExtension`,
    defaultMessage: 'This extension is not supported.',
  },
  setup: {
    id: `${displayName}.setup`,
    defaultMessage: 'Setup',
  },
});

const ExtensionDetails = () => {
  const { extensionId } = useParams();
  const { colony } = useColonyContext();
  const { extensionData, loading } = useExtensionData(extensionId ?? '');
  const { pathname } = useLocation();

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

  const { colonyAddress, name } = colony;

  const isSetupRoute = pathname.replace(/\/$/, '').endsWith('setup');
  const extensionUrl = `/colony/${name}/extensions/${extensionId}`;
  const breadCrumbs: Crumb[] = [
    [MSG.title, `/colony/${name}/extensions`],
    [extensionData.name, isSetupRoute ? extensionUrl : ''],
  ];
  if (isSetupRoute) {
    breadCrumbs.push(MSG.setup);
  }

  // @TODO: Extend these checks to include permissions, account and network interaction
  const canExtensionBeUninstalled = !!(
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    extensionData.isDeprecated
  );
  const canExtensionBeDeprecated =
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    !extensionData.isDeprecated;

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <BreadCrumb elements={breadCrumbs} />
        <hr className={styles.headerLine} />
      </div>

      <div>
        <Routes>
          <Route
            path="/"
            element={
              <div className={styles.extensionText}>
                <Heading
                  tagName="h3"
                  appearance={{
                    size: 'medium',
                    margin: 'small',
                    theme: 'dark',
                  }}
                  text={extensionData.name}
                />

                {/* @TODO: Handle h4 chunks */}
                <FormattedMessage {...extensionData.descriptionLong} />

                <div>
                  Details of <FormattedMessage {...extensionData.name} />
                  <br />
                  {isInstalledExtensionData(extensionData) ? (
                    <>
                      <div>Status: {extensionData.status}</div>
                      <div>
                        Is Deprecated:{' '}
                        {extensionData.isDeprecated ? 'yes' : 'no'}
                      </div>
                      <div>Version: {extensionData.version}</div>
                    </>
                  ) : (
                    <div>This extension is not installed</div>
                  )}
                </div>
              </div>
            }
          />
          <Route
            path={COLONY_EXTENSION_SETUP_ROUTE}
            element={<div>Setup</div>}
          />

          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </div>

      <ExtensionDetailsAside
        extensionData={extensionData}
        canBeDeprecated={canExtensionBeDeprecated}
        canBeUninstalled={canExtensionBeUninstalled}
        colonyAddress={colonyAddress}
      />
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
