import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { MiniSpinnerLoader } from '~shared/Preloaders';
import Heading from '~shared/Heading';
import NavLink from '~shared/NavLink';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';

import { useColonyContext, useExtensionsData } from '~hooks';

import styles from './ColonyExtensionsWidget.css';

const displayName = 'common.ColonyHome.ColonyExtensionsWidget';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Enabled extensions',
  },
  loadingData: {
    id: `${displayName}.loadingData`,
    defaultMessage: 'Loading extensions data ...',
  },
});

const ColonyExtensions = () => {
  const { colony } = useColonyContext();

  const { installedExtensionsData, loading } = useExtensionsData();

  if (loading) {
    return <MiniSpinnerLoader className={styles.main} title={MSG.title} loadingText={MSG.loadingData} />;
  }

  if (!installedExtensionsData.length) {
    return null;
  }

  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <FormattedMessage {...MSG.title} />
      </Heading>
      <ul>
        {installedExtensionsData
          // @TODO: Refactor once we have a way to check missingPermissions
          .filter(
            (extension) => extension.isInitialized,
            // && !extension.details?.missingPermissions.length,
          )
          .map((extension) => {
            const { address, extensionId } = extension;
            return (
              <li key={address} className={styles.extension}>
                <NavLink
                  className={styles.invisibleLink}
                  to={`/colony/${colony?.name}/extensions/${extensionId}`}
                  text={extension.name}
                />
                <ExtensionStatusBadge extensionData={extension} deprecatedOnly />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

ColonyExtensions.displayName = displayName;

export default ColonyExtensions;
