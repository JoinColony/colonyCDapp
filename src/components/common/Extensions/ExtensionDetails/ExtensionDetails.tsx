import React from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext, useExtensionData } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import NotFoundRoute from '~routes/NotFoundRoute';
import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes';
import { isInstalledExtensionData } from '~utils/extensions';
import BreadCrumb, { Crumb } from '~shared/BreadCrumb';
import Heading from '~shared/Heading';

import ExtensionDetailsAside from './ExtensionDetailsAside';
import ExtensionSetup from '../ExtensionSetup';

import styles from './ExtensionDetails.css';

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

  const isSetupRoute = pathname.replace(/\/$/, '').endsWith('setup');
  const extensionUrl = `/colony/${colony.name}/extensions/${extensionId}`;
  const breadCrumbs: Crumb[] = [
    [MSG.title, `/colony/${colony.name}/extensions`],
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

                {/* @NOTE: This is some ugly displayed extension info until we have a nice table */}
                <div>
                  Details of <FormattedMessage {...extensionData.name} />
                  <br />
                  {isInstalledExtensionData(extensionData) ? (
                    <>
                      <div>
                        Is Initialized:{' '}
                        {extensionData.isInitialized ? 'yes' : 'no'}
                      </div>
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
          {isInstalledExtensionData(extensionData) && (
            <Route
              path={COLONY_EXTENSION_SETUP_ROUTE}
              element={<ExtensionSetup extensionData={extensionData} />}
            />
          )}

          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </div>

      <ExtensionDetailsAside
        extensionData={extensionData}
        canBeDeprecated={canExtensionBeDeprecated}
        canBeUninstalled={canExtensionBeUninstalled}
      />
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
