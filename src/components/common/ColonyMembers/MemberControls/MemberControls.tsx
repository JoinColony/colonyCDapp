import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
// import { ColonyVersion, Extension } from '@colony/colony-js';

import Button from '~shared/Button';
import InviteLinkButton from '~shared/Button/InviteLinkButton';
// import { useDialog } from '~shared/Dialog';
// import { BanUserDialog } from '~shared/Comment';
// import PermissionManagementDialog from '~dialogs/PermissionManagementDialog';
// import WrongNetworkDialog from '~dialogs/WrongNetworkDialog';
// import ManageWhitelistDialog from '~dialogs/ManageWhitelistDialog';

// import { Colony, useColonyExtensionsQuery, useLoggedInUser } from '~data/index';
// import { useAppContext, useTransformer } from '~hooks';
import { useColonyContext } from '~hooks';
// import { getAllUserRoles } from '~redux/transformers';
// import { hasRoot, canAdminister, canArchitect } from '~modules/users/checks';
// import { oneTxMustBeUpgraded } from '~modules/dashboard/checks';

import styles from './MemberControls.css';

const displayName = 'common.ColonyMembers.MemberControls';

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
  manageWhitelist: {
    id: `${displayName}.manageWhitelist`,
    defaultMessage: 'Manage address book',
  },
});

type Props = {
  isRootDomain: boolean;
};

const MemberControls = ({ isRootDomain }: Props) => {
  const { colony } = useColonyContext();
  // const {
  //   networkId,
  //   username,
  //   ethereal,
  //   walletAddress: currentUserWalletAddress,
  // } = useLoggedInUser();
  // const {
  //   user: { name },
  //   wallet: currentUserWalletAddress,
  // } = useAppContext();

  // const openToggleBanningDialog = useDialog(BanUserDialog);

  // const { data: colonyExtensions } = useColonyExtensionsQuery({
  //   variables: { address: colonyAddress },
  // });

  // const openPermissionManagementDialog =  useDialog(PermissionManagementDialog);

  const handlePermissionManagementDialog = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('Open permissions dialog');
    // openPermissionManagementDialog({
    //   colony,
    // });
  }, []);

  // const openToggleManageWhitelistDialog = useDialog(ManageWhitelistDialog);

  const handleToggleWhitelistDialog = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('Open whitelist dialog');
    // return openToggleManageWhitelistDialog({
    //   colony,
    // });
  }, []);

  // eslint-disable-next-line max-len
  // const oneTxPaymentExtension =
  //   colonyExtensions?.processedColony?.installedExtensions.find(
  //     ({ details, extensionId: extensionName }) =>
  //       details?.initialized &&
  //       !details?.missingPermissions.length &&
  //       extensionName === Extension.OneTxPayment,
  //   );
  // const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);

  // const isSupportedColonyVersion =
  //   parseInt(version || '1', 10) >= ColonyVersion.LightweightSpaceship;

  // const currentUserRoles = useTransformer(getAllUserRoles, [
  //   colony,
  //   currentUserWalletAddress,
  // ]);
  const canMamangePermissions = true;
  //   (hasRegisteredProfile && canArchitect(currentUserRoles)) ||
  //   hasRoot(currentUserRoles);
  const canAdministerComments = true;
  //   hasRegisteredProfile &&
  //   (hasRoot(currentUserRoles) || canAdminister(currentUserRoles));
  const canManageWhitelist = true;
  //  hasRegisteredProfile && hasRoot(currentUserRoles);

  const controlsDisabled = false;
  // !isSupportedColonyVersion ||
  // !isNetworkAllowed ||
  // !hasRegisteredProfile ||
  // !isDeploymentFinished ||
  // mustUpgradeOneTx;

  return (
    !controlsDisabled && (
      <ul className={styles.controls}>
        {isRootDomain && (
          <li>
            <InviteLinkButton
              colonyName={colony?.name || ''}
              buttonAppearance={{ theme: 'blue' }}
            />
          </li>
        )}
        {canMamangePermissions && (
          <li>
            <Button
              appearance={{ theme: 'blue' }}
              text={MSG.editPermissions}
              onClick={handlePermissionManagementDialog}
            />
          </li>
        )}
        {canAdministerComments && (
          <>
            <li>
              <Button
                appearance={{ theme: 'blue' }}
                text={MSG.banAddress}
                onClick={
                  // eslint-disable-next-line no-console
                  () => console.log('Open banning dialog')
                  // openToggleBanningDialog({
                  //   colonyAddress,
                  // })
                }
              />
            </li>
            <li>
              <Button
                appearance={{ theme: 'blue' }}
                text={MSG.unbanAddress}
                onClick={
                  // eslint-disable-next-line no-console
                  () => console.log('Open banning dialog')
                  // openToggleBanningDialog({
                  //   isBanning: false,
                  //   colonyAddress,
                  // })
                }
              />
            </li>
          </>
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
    )
  );
};

MemberControls.displayName = displayName;

export default MemberControls;
