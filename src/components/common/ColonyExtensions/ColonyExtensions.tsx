import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { getExtensionHash } from '@colony/colony-js';

import {
  InstallableExtensionData,
  InstalledExtensionData,
  supportedExtensionsConfig,
} from '~constants/extensions';
import {
  useGetColonyExtensionsQuery,
  useGetCurrentExtensionsVersionsQuery,
} from '~gql';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';

// import BreadCrumb from '~core/BreadCrumb';
// import { Address } from '~types/index';
// import extensionData from '~data/staticData/extensionData';
import Heading from '~shared/Heading';
import { SpinnerLoader } from '~shared/Preloaders';

import ExtensionCard from './ExtensionCard/ExtensionCard';

import styles from './ColonyExtensions.css';

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
  const { colony } = useColonyContext();

  const { data, loading } = useGetColonyExtensionsQuery({
    variables: {
      colonyAddress: colony?.colonyAddress ?? '',
    },
    skip: !colony,
  });
  const colonyExtensions = data?.getColony?.extensions?.items.filter(notNull);

  const { data: versionsData } = useGetCurrentExtensionsVersionsQuery();

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

  const availableExtensionsData = useMemo<InstallableExtensionData[]>(() => {
    if (!colonyExtensions) {
      return [];
    }

    return supportedExtensionsConfig.reduce(
      (availableExtensions, extensionConfig) => {
        const extensionHash = getExtensionHash(extensionConfig.extensionId);
        const isExtensionInstalled = !!colonyExtensions.find(
          (e) => e.hash === extensionHash,
        );
        const availableVersion = versionsData?.listCurrentVersions?.items.find(
          (i) => i?.extensionHash === extensionHash,
        )?.version;

        if (!isExtensionInstalled && availableVersion) {
          return [
            ...availableExtensions,
            {
              ...extensionConfig,
              availableVersion,
            },
          ];
        }

        return availableExtensions;
      },
      [],
    );
  }, [colonyExtensions, versionsData]);

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={MSG.loading}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
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
            <Heading
              tagName="h3"
              appearance={{ size: 'normal' }}
              text={MSG.installedExtensions}
            />

            <div className={styles.cards}>
              {installedExtensionsData.map((extension) => (
                <ExtensionCard
                  key={extension.extensionId}
                  extension={extension}
                />
              ))}
            </div>
          </div>
        )}

        {availableExtensionsData.length > 0 && (
          <div>
            <Heading
              tagName="h3"
              appearance={{ size: 'normal' }}
              text={MSG.availableExtensions}
            />

            <div className={styles.cards}>
              {availableExtensionsData.map((extension) => (
                <ExtensionCard
                  key={extension.extensionId}
                  extension={extension}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ColonyExtensions.displayName = displayName;

export default ColonyExtensions;
