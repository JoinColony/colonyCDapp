import React from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useColonyContext, useExtensionData, useAppContext } from '~hooks';
import { SpinnerLoader } from '~shared/Preloaders';
import { COLONY_EXTENSIONS_ROUTE, COLONY_EXTENSION_SETUP_ROUTE } from '~routes';
import { isInstalledExtensionData } from '~utils/extensions';
import BreadCrumb, { Crumb } from '~shared/BreadCrumb';
import { Heading3, Heading4 } from '~shared/Heading';

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

const HeadingChunks = (chunks: React.ReactNode[]) => (
  <Heading4 appearance={{ size: 'medium', margin: 'small' }}>{chunks}</Heading4>
);

const ExtensionDetails = () => {
  const { extensionId } = useParams();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { extensionData, loading, ...pollingControls } = useExtensionData(
    extensionId ?? '',
  );
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
  const extensionUrl = `/${colony.name}/${COLONY_EXTENSIONS_ROUTE}/${extensionId}`;
  const breadCrumbs: Crumb[] = [
    [MSG.title, `/${colony.name}/${COLONY_EXTENSIONS_ROUTE}`],
    [extensionData.name, isSetupRoute ? extensionUrl : ''],
  ];
  if (isSetupRoute) {
    breadCrumbs.push(MSG.setup);
  }

  const hasRegisteredProfile = !!user;
  // @TODO: Extend these checks to include permissions, account and network interaction
  const canExtensionBeUninstalled = !!(
    hasRegisteredProfile &&
    isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    extensionData.isDeprecated
  );
  const canExtensionBeDeprecated =
    hasRegisteredProfile &&
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
            index
            element={
              <div className={styles.extensionText}>
                <Heading3
                  appearance={{
                    size: 'medium',
                    margin: 'small',
                    theme: 'dark',
                  }}
                  text={extensionData.name}
                />

                <FormattedMessage
                  {...extensionData.descriptionLong}
                  values={{
                    h4: HeadingChunks,
                  }}
                />
              </div>
            }
          />
          {isInstalledExtensionData(extensionData) && (
            <Route
              path={COLONY_EXTENSION_SETUP_ROUTE}
              element={<ExtensionSetup extensionData={extensionData} />}
            />
          )}
        </Routes>
      </div>

      <ExtensionDetailsAside
        extensionData={extensionData}
        canBeDeprecated={canExtensionBeDeprecated}
        canBeUninstalled={canExtensionBeUninstalled}
        pollingControls={pollingControls}
      />
    </div>
  );
};

ExtensionDetails.displayName = displayName;

export default ExtensionDetails;
