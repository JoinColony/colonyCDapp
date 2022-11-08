import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { useQuery, gql } from '@apollo/client';

// import { ColonyVersion, Extension } from '@colony/colony-js';

// import Button from '~core/Button';
// import { useDialog } from '~core/Dialog';
// import { BanUserDialog } from '~core/Comment';
import LoadingTemplate from '~frame/LoadingTemplate';
// import Members from '~dashboard/Members';
// import PermissionManagementDialog from '~dialogs/PermissionManagementDialog';
// import WrongNetworkDialog from '~dashboard/ColonyHome/WrongNetworkDialog';
// import {
//   useColonyFromNameQuery,
//   Colony,
//   useColonyExtensionsQuery,
//   useBannedUsersQuery,
// } from '~data/index';
// import { useTransformer } from '~utils/hooks';
// import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
// import { NOT_FOUND_ROUTE } from '~routes/index';
// import { checkIfNetworkIsAllowed } from '~utils/networks';
// import { getAllUserRoles } from '~modules/transformers';
// import { hasRoot, canAdminister } from '~modules/users/checks';
// import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';
import NotFoundRoute from '~routes/NotFoundRoute';

import { getFullColonyByName } from '~gql';
import { useCanInteractWithColony } from '~hooks';

import styles from './ColonyMembers.css';

const displayName = 'common.ColonyMembers';

const MSG = defineMessages({
  editPermissions: {
    id: `${displayName}.editPermissions`,
    defaultMessage: 'Edit permissions',
  },
  banAddress: {
    id: `${displayName}.banAddress`,
    defaultMessage: 'Ban address',
  },
  unbanAddress: {
    id: `${displayName}.unbanAddress`,
    defaultMessage: 'Unban address',
  },
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
});

const ColonyMembers = () => {
  const { colonyName } = useParams<{
    colonyName: string;
    extensionId?: string;
  }>();

  const { data, loading, error } = useQuery(gql(getFullColonyByName), {
    variables: {
      name: colonyName,
    },
  });

  const [colony] = data?.getColonyByName?.items || [];

  const canInteractWithCurrentColony = useCanInteractWithColony(colony);

  if (loading || (colony && colony.name !== colonyName)) {
    return (
      <div className={styles.loadingWrapper}>
        <LoadingTemplate loadingText={MSG.loadingText} />
      </div>
    );
  }

  if (
    !colonyName ||
    error ||
    !colony ||
    colony instanceof Error
    // || !isExtensionIdValid
  ) {
    return <NotFoundRoute />;
  }

  return (
    <div className={styles.main}>
      <div className={styles.mainContentGrid}>
        <div className={styles.mainContent}>
          Colony Members
          {canInteractWithCurrentColony && <p>Colony can be interacted with</p>}
        </div>
        <aside className={styles.rightAside} />
      </div>
    </div>
  );

  // const hasRegisteredProfile = !!username && !ethereal;

  // const openWrongNetworkDialog = useDialog(WrongNetworkDialog);
  // const openToggleBanningDialog = useDialog(BanUserDialog);

  // const { colonyName } = useParams<{
  //   colonyName: string;
  // }>();

  // const {
  //   data: colonyData,
  //   error,
  //   loading,
  // } = useColonyFromNameQuery({
  //   variables: { name: colonyName, address: '' },
  // });

  // const colonyAddress = colonyData?.processedColony?.colonyAddress || '';

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress,
  // });

  // const { data: colonyExtensions, loading: colonyExtensionLoading } =
  //   useColonyExtensionsQuery({
  //     variables: { address: colonyAddress },
  //   });

  // const { data: bannedMembers, loading: loadingBannedUsers } =
  //   useBannedUsersQuery({
  //     variables: {
  //       colonyAddress,
  //     },
  //   });

  // const openPermissionManagementDialog = useDialog(PermissionManagementDialog);

  // const handlePermissionManagementDialog = useCallback(() => {
  //   openPermissionManagementDialog({
  //     colony: colonyData?.processedColony as Colony,
  //     isVotingExtensionEnabled,
  //   });
  // }, [openPermissionManagementDialog, colonyData, isVotingExtensionEnabled]);

  // // eslint-disable-next-line max-len
  // const oneTxPaymentExtension =
  //   colonyExtensions?.processedColony?.installedExtensions.find(
  //     ({ details, extensionId: extensionName }) =>
  //       details?.initialized &&
  //       !details?.missingPermissions.length &&
  //       extensionName === Extension.OneTxPayment,
  //   );
  // const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);

  // const isSupportedColonyVersion =
  //   parseInt(colonyData?.processedColony?.version || '1', 10) >=
  //   ColonyVersion.LightweightSpaceship;

  // const currentUserRoles = useTransformer(getAllUserRoles, [
  //   colonyData?.processedColony,
  //   currentUserWalletAddress,
  // ]);
  // const canAdministerComments =
  //   hasRegisteredProfile &&
  //   (hasRoot(currentUserRoles) || canAdminister(currentUserRoles));

  // const controlsDisabled =
  //   !isSupportedColonyVersion ||
  //   !colonyData?.processedColony?.isDeploymentFinished ||
  //   mustUpgradeOneTx;

  // if (
  //   loading ||
  //   colonyExtensionLoading ||
  //   loadingBannedUsers ||
  //   (colonyData?.colonyAddress &&
  //     !colonyData.processedColony &&
  //     !((colonyData.colonyAddress as any) instanceof Error))
  // ) {
  //   return (
  //     <div className={styles.loadingWrapper}>
  //       <LoadingTemplate loadingText={MSG.loadingText} />
  //     </div>
  //   );
  // }

  // if (!colonyName || error || !colonyData?.processedColony) {
  //   console.error(error);
  //   return <Redirect to={NOT_FOUND_ROUTE} />;
  // }

  // return (
  //   <div className={styles.main}>
  //     <div className={styles.mainContentGrid}>
  //       <div className={styles.mainContent}>
  //         {colonyData && colonyData.processedColony && (
  //           <Members
  //             colony={colonyData.processedColony}
  //             bannedUsers={bannedMembers?.bannedUsers || []}
  //           />
  //         )}
  //       </div>
  //       <aside className={styles.rightAside}>
  //         {!controlsDisabled && (
  //           <ul className={styles.controls}>
  //             <li>
  //               <Button
  //                 appearance={{ theme: 'blue' }}
  //                 text={MSG.editPermissions}
  //                 onClick={handlePermissionManagementDialog}
  //                 disabled={
  //                   !isSupportedColonyVersion ||
  //                   !colonyData?.processedColony?.isDeploymentFinished ||
  //                   mustUpgradeOneTx
  //                 }
  //               />
  //             </li>
  //             {canAdministerComments && (
  //               <>
  //                 <li>
  //                   <Button
  //                     appearance={{ theme: 'blue' }}
  //                     text={MSG.banAddress}
  //                     onClick={() =>
  //                       openToggleBanningDialog({
  //                         colonyAddress:
  //                           colonyData?.processedColony?.colonyAddress,
  //                       })
  //                     }
  //                   />
  //                 </li>
  //                 <li>
  //                   <Button
  //                     appearance={{ theme: 'blue' }}
  //                     text={MSG.unbanAddress}
  //                     onClick={() =>
  //                       openToggleBanningDialog({
  //                         isBanning: false,
  //                         colonyAddress:
  //                           colonyData?.processedColony?.colonyAddress,
  //                       })
  //                     }
  //                   />
  //                 </li>
  //               </>
  //             )}
  //           </ul>
  //         )}
  //       </aside>
  //     </div>
  //   </div>
  // );
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
