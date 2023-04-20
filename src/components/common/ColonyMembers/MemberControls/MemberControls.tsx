import React from 'react';
// import { defineMessages } from 'react-intl';
import { Extension } from '@colony/colony-js';

import InviteLinkButton from '~shared/Button/InviteLinkButton';
// import Button from '~shared/Button';
// import { useDialog } from '~shared/Dialog';
// import PermissionManagementDialog from '~dialogs/PermissionManagementDialog';
// import ManageWhitelistDialog from '~dialogs/ManageWhitelistDialog';
import { isInstalledExtensionData } from '~utils/extensions';
import { useColonyContext, useExtensionData } from '~hooks';

import styles from './MemberControls.css';

const displayName = 'common.ColonyMembers.MemberControls';

// const MSG = defineMessages({
//   editPermissions: {
//     id: `${displayName}.editPermissions`,
//     defaultMessage: 'Edit permissions',
//   },
//   manageWhitelist: {
//     id: `${displayName}.manageWhitelist`,
//     defaultMessage: 'Manage address book',
//   },
// });

type Props = {
  isRootOrAllDomains: boolean;
};

const MemberControls = ({ isRootOrAllDomains }: Props) => {
  const { colony } = useColonyContext();

  // const openPermissionManagementDialog =  useDialog(PermissionManagementDialog);
  // const handlePermissionManagementDialog = useCallback(() => {
  //   openPermissionManagementDialog({
  //     colony,
  //   });
  // }, []);

  // const openToggleManageWhitelistDialog = useDialog(ManageWhitelistDialog);
  // const handleToggleWhitelistDialog = useCallback(() => {
  //   return openToggleManageWhitelistDialog({
  //     colony,
  //   });
  // }, []);

  const { extensionData } = useExtensionData(Extension.OneTxPayment);
  const mustUpgradeOneTx =
    extensionData && isInstalledExtensionData(extensionData)
      ? extensionData?.currentVersion < extensionData?.availableVersion
      : false;

  // const currentUserRoles = useTransformer(getAllUserRoles, [
  //   colony,
  //   currentUserWalletAddress,
  // ]);
  // const canManagePermissions =
  //   (hasRegisteredProfile && canArchitect(currentUserRoles)) ||
  //   hasRoot(currentUserRoles);

  // const canManageWhitelist = hasRegisteredProfile && hasRoot(currentUserRoles);

  const controlsDisabled = mustUpgradeOneTx;
  // !isSupportedColonyVersion ||
  // !isNetworkAllowed ||
  // !hasRegisteredProfile ||
  // !isDeploymentFinished ||

  return (
    <>
      {!controlsDisabled && (
        <ul className={styles.controls}>
          {isRootOrAllDomains && (
            <li>
              <InviteLinkButton colonyName={colony?.name || ''} buttonAppearance={{ theme: 'blue' }} />
            </li>
          )}
          {/* {canMamangePermissions && (
          <li>
            <Button
              appearance={{ theme: 'blue' }}
              text={MSG.editPermissions}
              onClick={handlePermissionManagementDialog}
            />
          </li>
        )}
          {canManageWhitelist && (
          <li>
            <Button
              appearance={{ theme: 'blue' }}
              text={MSG.manageWhitelist}
              onClick={handleToggleWhitelistDialog}
            />
          </li>
        )} */}
        </ul>
      )}
    </>
  );
};

MemberControls.displayName = displayName;

export default MemberControls;
