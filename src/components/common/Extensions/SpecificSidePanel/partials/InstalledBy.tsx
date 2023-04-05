import React, { FC } from 'react';

import { useUserByNameOrAddress } from '~hooks';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';
import { AnyExtensionData, InstalledExtensionData } from '~types';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import { useGetInstalledByData } from './hooks';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';

const displayName = 'common.Extensions.partials.InstalledBy';

const InstalledBy: FC<PanelTypeProps> = ({ title, extensionData }) => {
  const { user } = useUserByNameOrAddress(
    (extensionData as InstalledExtensionData)?.installedBy,
  );
  const { bio, displayName: userDisplayName } = user?.profile || {};
  const username = user?.name;
  const installedByData = useGetInstalledByData(
    extensionData as AnyExtensionData,
  );
  const { colonyReputationItems } = installedByData || {};

  // @TODO: add permissions and verify badge after they will be added to API
  return (
    <div className={styles.panelRow}>
      <div className={styles.panelTitle}>{title}</div>
      <div className="flex">
        <UserAvatarPopover
          userName={userDisplayName || username || ''}
          walletAddress={splitWalletAddress(user?.walletAddress || '')}
          isVerified
          aboutDescription={bio || ''}
          colonyReputation={colonyReputationItems}
          user={user}
          // permissions={permissionsItems}
        />
      </div>
    </div>
  );
};

InstalledBy.displayName = displayName;

export default InstalledBy;
