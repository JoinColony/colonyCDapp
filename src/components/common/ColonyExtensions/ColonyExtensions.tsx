import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useExtensionsData } from '~hooks';
import { Heading3 } from '~shared/Heading';
import { SpinnerLoader } from '~shared/Preloaders';

import ExtensionCard from './ExtensionCard';

import styles from './ColonyExtensions.css';
import SubNavigation from '~common/Extensions/SubNavigation/SubNavigation';

const displayName = 'common.ColonyExtensions';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Extensions',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: 'Extend the functionality of your colony with extensions',
  },
  installedExtensions: {
    id: `${displayName}.installedExtensions`,
    defaultMessage: 'Installed Extensions',
  },
  availableExtensions: {
    id: `${displayName}.availableExtensions`,
    defaultMessage: 'Available Extensions',
  },
  loading: {
    id: `${displayName}.loading`,
    defaultMessage: `Loading Extensions`,
  },
});

const ColonyExtensions = () => {
  const { installedExtensionsData, availableExtensionsData, loading } = useExtensionsData();

  if (loading) {
    return <SpinnerLoader loadingText={MSG.loading} appearance={{ theme: 'primary', size: 'massive' }} />;
  }

  return (
    <div className={styles.main}>
      <h2 className={styles.heading}>
        <FormattedMessage {...MSG.title} />
      </h2>
      <div className={styles.description}>
        <FormattedMessage {...MSG.description} />
      </div>
      <hr />

      <div className={styles.content}>
        {installedExtensionsData.length > 0 && (
          <div>
            <Heading3 appearance={{ size: 'normal' }} text={MSG.installedExtensions} />

            <div className={styles.cards}>
              {installedExtensionsData.map((extensionData) => (
                <ExtensionCard key={extensionData.extensionId} extensionData={extensionData} />
              ))}
            </div>
          </div>
        )}

        {availableExtensionsData.length > 0 && (
          <div>
            <Heading3 appearance={{ size: 'normal' }} text={MSG.availableExtensions} />

            <div className={styles.cards}>
              {availableExtensionsData.map((extensionData) => (
                <ExtensionCard key={extensionData.extensionId} extensionData={extensionData} />
              ))}
            </div>
          </div>
        )}
      </div>
      <SubNavigation />
    </div>
  );
};

ColonyExtensions.displayName = displayName;

export default ColonyExtensions;
