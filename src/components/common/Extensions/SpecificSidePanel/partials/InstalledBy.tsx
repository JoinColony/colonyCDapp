import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useExtensionData, useUserByNameOrAddress } from '~hooks';
import UserAvatarPopover from '~shared/Extensions/UserAvatarPopover';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';
import { InstalledExtensionData } from '~types';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import { colonyReputationItems, permissionsItems } from '~shared/Extensions/UserAvatarPopover/partials/consts';

const displayName = 'common.Extensions.partials.InstalledBy';

const InstalledBy: FC<PanelTypeProps> = ({ title }) => {
  const { extensionId } = useParams();
  const { extensionData } = useExtensionData(extensionId ?? '');

  const { user } = useUserByNameOrAddress((extensionData as InstalledExtensionData)?.installedBy);
  const userDisplayName = user?.profile?.displayName;
  const username = user?.name;

  // @TODO: display missing data from API
  return (
    <div className={styles.panelRow}>
      <div className={styles.panelTitle}>{title}</div>
      <div className="flex">
        <UserAvatarPopover
          userName={userDisplayName || username}
          walletAddress={splitWalletAddress(user?.walletAddress || '')}
          isVerified
          aboutDescription={`Passionate about sustainability and living a zero-waste lifestyle.
          Lover of all things vintage and retro. High-tops are my everything.`}
          colonyReputation={colonyReputationItems}
          permissions={permissionsItems}
        />
      </div>
    </div>
  );
};

InstalledBy.displayName = displayName;

export default InstalledBy;
