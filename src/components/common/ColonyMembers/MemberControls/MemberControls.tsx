import React from 'react';
import { Extension } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import InviteLinkButton from '~shared/Button/InviteLinkButton';
import { isInstalledExtensionData } from '~utils/extensions';
import {
  useAppContext,
  useCanInteractWithNetwork,
  useColonyContext,
  useEnabledExtensions,
  useExtensionData,
} from '~hooks';

import { canArchitect, hasRoot } from '~utils/checks';
import { getAllUserRoles } from '~transformers';
import Button from '~shared/Button/Button';
import { useDialog } from '~shared/Dialog';
import {
  ManageWhitelistDialog,
  PermissionManagementDialog,
} from '~common/Dialogs';

import styles from './MemberControls.css';

const displayName = 'common.ColonyMembers.MemberControls';

const MSG = defineMessages({
  editPermissions: {
    id: `${displayName}.editPermissions`,
    defaultMessage: 'Edit permissions',
  },
  manageWhitelist: {
    id: `${displayName}.manageWhitelist`,
    defaultMessage: 'Manage address book',
  },
});

type Props = {
  isRootOrAllDomains: boolean;
};

const MemberControls = ({ isRootOrAllDomains }: Props) => {
  const { colony, isSupportedColonyVersion } = useColonyContext();
  const canInteractWithNetwork = useCanInteractWithNetwork();
  const { user } = useAppContext();
  const currentUserRoles = getAllUserRoles(colony, user?.walletAddress);
  const enabledExtensionData = useEnabledExtensions();
  const { extensionData } = useExtensionData(Extension.OneTxPayment);

  const canManagePermissions =
    (user && canArchitect(currentUserRoles)) || hasRoot(currentUserRoles);
  const canManageWhitelist = user && hasRoot(currentUserRoles);

  const openPermissionManagementDialog = useDialog(PermissionManagementDialog);
  const openToggleManageWhitelistDialog = useDialog(ManageWhitelistDialog);

  if (!colony) {
    return null;
  }

  const handlePermissionManagementDialog = () =>
    openPermissionManagementDialog({
      colony,
      enabledExtensionData,
    });

  const handleToggleWhitelistDialog = () =>
    openToggleManageWhitelistDialog({
      colony,
      enabledExtensionData,
    });

  const mustUpgradeOneTx =
    extensionData && isInstalledExtensionData(extensionData)
      ? extensionData?.currentVersion < extensionData?.availableVersion
      : false;

  const controlsDisabled =
    mustUpgradeOneTx ||
    !isSupportedColonyVersion ||
    !canInteractWithNetwork ||
    !user;

  return (
    <>
      {!controlsDisabled && (
        <ul className={styles.controls}>
          {isRootOrAllDomains && (
            <li>
              <InviteLinkButton
                colonyName={colony?.name || ''}
                buttonAppearance={{ theme: 'blue' }}
              />
            </li>
          )}
          {canManagePermissions && (
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
          )}
        </ul>
      )}
    </>
  );
};

MemberControls.displayName = displayName;

export default MemberControls;
