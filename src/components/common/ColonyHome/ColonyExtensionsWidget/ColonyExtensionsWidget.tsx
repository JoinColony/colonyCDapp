import React from 'react';
// import { defineMessages, FormattedMessage } from 'react-intl';

// import Heading from '~core/Heading';
// import { useColonyExtensionsQuery } from '~data/index';
// import { MiniSpinnerLoader } from '~core/Preloaders';
// import extensionData from '~data/staticData/extensionData';
// import NavLink from '~core/NavLink';
// import ExtensionStatus from '~dashboard/Extensions/ExtensionStatus';
// import { useColonyContext } from '~hooks';

// import styles from './ColonyExtensions.css';

const displayName = 'dashboard.ColonyHome.ColonyExtensionsWidget';

// const MSG = defineMessages({
//   title: {
//     id: `${displayName}.title`,
//     defaultMessage: 'Enabled extensions',
//   },
//   loadingData: {
//     id: `${displayName}.loadingData`,
//     defaultMessage: 'Loading extensions data ...',
//   },
// });

const ColonyExtensions = () => {
  // const { colony } = useColonyContext();

  // const { data, loading } = useColonyExtensionsQuery({
  //   variables: { address: colony?.colonyAddress },
  // });

  // if (loading) {
  //   return (
  //     <MiniSpinnerLoader
  //       className={styles.main}
  //       title={MSG.title}
  //       loadingText={MSG.loadingData}
  //     />
  //   );
  // }

  // return data?.processedColony ? (
  //   <div className={styles.main}>
  //     <Heading appearance={{ size: 'normal', weight: 'bold' }}>
  //       <FormattedMessage {...MSG.title} />
  //     </Heading>
  //     <ul>
  //       {data.processedColony.installedExtensions
  //         .filter(
  //           (extension) =>
  //             extension.details?.initialized &&
  //             !extension.details?.missingPermissions.length,
  //         )
  //         .map((extension) => {
  //           const { address, extensionId } = extension;
  //           return (
  //             <li key={address} className={styles.extension}>
  //               <NavLink
  //                 className={styles.invisibleLink}
  //                 to={`/colony/${colony?.name}/extensions/${extensionId}`}
  //                 text={extensionData[extensionId].name}
  //               />
  //               <ExtensionStatus
  //                 installedExtension={extension}
  //                 deprecatedOnly
  //               />
  //             </li>
  //           );
  //         })}
  //     </ul>
  //   </div>
  // ) : null;

  return <div>Colony Extensions Widget</div>;
};

ColonyExtensions.displayName = displayName;

export default ColonyExtensions;
