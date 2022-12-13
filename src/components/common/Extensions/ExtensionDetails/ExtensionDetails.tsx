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

import styles from './ExtensionDetails.css';

const displayName = 'common.Extensions.ExtensionDetails';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Extensions',
  },
  buttonAdd: {
    id: `${displayName}.buttonAdd`,
    defaultMessage: 'Add',
  },
  status: {
    id: `${displayName}.status`,
    defaultMessage: 'Status',
  },
  installedBy: {
    id: `${displayName}.installedBy`,
    defaultMessage: 'Installed by',
  },
  dateCreated: {
    id: `${displayName}.dateCreated`,
    defaultMessage: 'Date created',
  },
  dateInstalled: {
    id: `${displayName}.dateInstalled`,
    defaultMessage: 'Date installed',
  },
  latestVersion: {
    id: `${displayName}.latestVersion`,
    defaultMessage: 'Latest version',
  },
  versionInstalled: {
    id: `${displayName}.versionInstalled`,
    defaultMessage: 'Version installed',
  },
  contractAddress: {
    id: `${displayName}.contractAddress`,
    defaultMessage: 'Contract address',
  },
  developer: {
    id: `${displayName}.developer`,
    defaultMessage: 'Developer',
  },
  permissionsNeeded: {
    id: `${displayName}.permissionsNeeded`,
    defaultMessage: 'Permissions the extension needs in the colony:',
  },
  buttonUninstall: {
    id: `${displayName}.buttonUninstall`,
    defaultMessage: 'Uninstall',
  },
  buttonDeprecate: {
    id: `${displayName}.buttonDeprecate`,
    defaultMessage: 'Deprecate',
  },
  buttonReEnable: {
    id: `${displayName}.buttonReEnable`,
    defaultMessage: 'Re-enable',
  },
  headingDeprecate: {
    id: `${displayName}.headingDeprecate`,
    defaultMessage: 'Deprecate extension',
  },
  textDeprecate: {
    id: `${displayName}.textDeprecate`,
    defaultMessage: `This extension must first be deprecated if you wish to uninstall it. After deprecation, any actions using this extension already ongoing may be completed, but it will no longer be possible to create new actions requiring this extension. Are you sure you wish to proceed?`,
  },
  headingReEnable: {
    id: `${displayName}.headingReEnable`,
    defaultMessage: 'Re-enable extension',
  },
  textReEnable: {
    id: `${displayName}.textDeprecate`,
    defaultMessage: `The extension will be re-enabled with the same parameters. Are you sure you wish to proceed?`,
  },
  headingUninstall: {
    id: `${displayName}.headingUninstall`,
    defaultMessage: 'Uninstall extension',
  },
  textUninstall: {
    id: `${displayName}.textUninstall`,
    defaultMessage: `This extension is currently deprecated, and may be uninstalled. Doing so will remove it from the colony and any processes requiring it will no longer work. Are you sure you wish to proceed?`,
  },
  setup: {
    id: `${displayName}.setup`,
    defaultMessage: 'Setup',
  },
  warning: {
    id: `${displayName}.warning`,
    defaultMessage: `This extension is incompatible with your current colony version. You must upgrade your colony before installing it.`,
  },
  unsupportedExtension: {
    id: `${displayName}.unsupportedExtension`,
    defaultMessage: 'This extension is not supported.',
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

  const makeHeadingInMsg = (chunks: React.ReactNode[]) => (
    <Heading
      tagName="h4"
      appearance={{ size: 'medium', margin: 'small' }}
      text={chunks.toString()}
    />
  );

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

                <FormattedMessage
                  {...extensionData.descriptionLong}
                  values={{
                    h4: makeHeadingInMsg,
                    link0: extensionData.descriptionLinks?.[0],
                  }}
                />

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
      />
    </div>
  );
};

ExtensionDetails.displayName = displayName;
export default ExtensionDetails;
