import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { getExtensionHash } from '@colony/colony-js';

import { MiniSpinnerLoader } from '~shared/Preloaders';
import Heading from '~shared/Heading';
import NavLink from '~shared/NavLink';
import ExtensionStatusBadge from '~common/Extensions/ExtensionStatusBadge';

import { useColonyContext } from '~hooks';
import { useGetColonyExtensionsQuery } from '~gql';
import { InstalledExtensionData } from '~types';
import { notNull } from '~utils/arrays';
import { supportedExtensionsConfig } from '~constants/extensions';

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

  const { data, loading } = useGetColonyExtensionsQuery({
    variables: {
      colonyAddress: colony?.colonyAddress ?? '',
    },
    skip: !colony,
  });
  const colonyExtensions = data?.getColony?.extensions?.items.filter(notNull);

  const installedExtensionsData = useMemo<InstalledExtensionData[]>(() => {
    if (!colonyExtensions) {
      return [];
    }

    return colonyExtensions
      .map<InstalledExtensionData | null>((extension) => {
        const extensionConfig = supportedExtensionsConfig.find(
          (e) => getExtensionHash(e.extensionId) === extension?.hash,
        );

        if (!extensionConfig) {
          // Unsupported extension
          return null;
        }

        return {
          ...extensionConfig,
          ...extension,
        };
      })
      .filter(notNull);
  }, [colonyExtensions]);

  if (loading) {
    return (
      <MiniSpinnerLoader
        className={styles.main}
        title={MSG.title}
        loadingText={MSG.loadingData}
      />
    );
  }

  return installedExtensionsData.length ? (
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
                <ExtensionStatusBadge extension={extension} deprecatedOnly />
              </li>
            );
          })}
      </ul>
    </div>
  ) : null;
};

ColonyExtensions.displayName = displayName;

export default ColonyExtensions;
