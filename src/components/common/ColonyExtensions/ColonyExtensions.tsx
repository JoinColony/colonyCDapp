import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { getExtensionHash } from '@colony/colony-js';

import extensions, {
  InstalledExtensionData,
  supportedExtensionsConfig,
} from '~constants/extensions';
import { useGetColonyExtensionsQuery } from '~gql';
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

  const colonyExtensions = data?.getColony?.extensions?.items;

  const installedExtensionsData = useMemo<InstalledExtensionData[]>(() => {
    if (!colonyExtensions) {
      return [];
    }

    return colonyExtensions
      .map<InstalledExtensionData | null>((extension) => {
        const extensionConfig = supportedExtensionsConfig.find(
          (e) => getExtensionHash(e.extensionId) === extension?.hash,
        );

        if (!extension || !extensionConfig) {
          return null;
        }

        return {
          ...extensionConfig,
          ...extension,
        };
      })
      .filter(notNull);
  }, [colonyExtensions]);

  // const { data: networkExtensionData } = useNetworkExtensionVersionQuery();

  // const installedExtensionsData = useMemo(() => {
  //   if (data?.processedColony?.installedExtensions) {
  //     const { installedExtensions } = data.processedColony;
  //     return installedExtensions.map(
  //       ({ extensionId, address, details: { version } }) => ({
  //         ...extensionData[extensionId],
  //         address,
  //         currentVersion: version,
  //       }),
  //     );
  //   }
  //   return [];
  // }, [data]);

  // const availableExtensionsData = useMemo(() => {
  //   if (data?.processedColony?.installedExtensions) {
  //     const { installedExtensions } = data.processedColony;
  //     return extensions.reduce((availableExtensions, extensionName) => {
  //       const installedExtension = installedExtensions.find(
  //         ({ extensionId }) => extensionName === extensionId,
  //       );
  //       if (
  //         !installedExtension &&
  //         networkExtensionData?.networkExtensionVersion
  //       ) {
  //         const { networkExtensionVersion } = networkExtensionData;
  //         const networkExtension = networkExtensionVersion?.find(
  //           (extension) =>
  //             extension?.extensionHash === getExtensionHash(extensionName),
  //         );
  //         return [
  //           ...availableExtensions,
  //           {
  //             ...extensionData[extensionName],
  //             currentVersion: networkExtension?.version || 0,
  //           },
  //         ];
  //       }
  //       return availableExtensions;
  //     }, []);
  //   }
  //   return [];
  // }, [data, networkExtensionData]);

  if (loading) {
    return (
      <SpinnerLoader
        loadingText={MSG.loading}
        appearance={{ theme: 'primary', size: 'massive' }}
      />
    );
  }

  // return (
  //   <div className={styles.main}>
  //     <div className={styles.content}>
  //       <BreadCrumb elements={[MSG.title]} />
  //       <p className={styles.description}>
  //         <FormattedMessage {...MSG.description} />
  //       </p>
  //       <hr />
  //       {installedExtensionsData.length ? (
  //         <>
  //           <Heading
  //             tagName="h3"
  //             appearance={{ size: 'normal', margin: 'double' }}
  //             text={MSG.installedExtensions}
  //           />
  //           <div className={styles.cards}>
  //             {installedExtensionsData.map((extension, idx) => (
  //               <ExtensionCard
  //                 key={extension.extensionId}
  //                 extension={extension}
  //                 installedExtension={installedExtensions[idx]}
  //               />
  //             ))}
  //           </div>
  //         </>
  //       ) : null}
  //       {availableExtensionsData.length ? (
  //         <div className={styles.availableExtensionsWrapper}>
  //           <Heading
  //             tagName="h3"
  //             appearance={{ size: 'normal', margin: 'double' }}
  //             text={MSG.availableExtensions}
  //           />
  //           <div className={styles.cards}>
  //             {availableExtensionsData.map((extension) => (
  //               <ExtensionCard
  //                 key={extension.extensionId}
  //                 extension={extension}
  //               />
  //             ))}
  //           </div>
  //         </div>
  //       ) : null}
  //     </div>
  //   </div>
  // );

  return (
    <div className={styles.main}>
      <h2 className={styles.heading}>
        <FormattedMessage {...MSG.title} />
      </h2>
      <div className={styles.description}>
        <FormattedMessage {...MSG.description} />
      </div>
      <hr />

      <div className={styles.sections}>
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

        <div>
          <Heading
            tagName="h3"
            appearance={{ size: 'normal' }}
            text={MSG.availableExtensions}
          />

          <div className={styles.cards}>
            {extensions.map((extension) => (
              <ExtensionCard
                key={extension.extensionId}
                extension={extension}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

ColonyExtensions.displayName = displayName;

export default ColonyExtensions;
