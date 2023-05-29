import React, { FC } from 'react';
import { useUserByNameOrAddress } from '~hooks';
import UserAvatarPopover from '~shared/Extensions/UserAvatarPopover';
import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';

const displayName = 'common.Extensions.partials.InstalledBy';

const InstalledBy: FC<PanelTypeProps> = ({
  title,
  installedBy,
  addressWallet,
  isVerified,
  copyUrl = '',
  aboutDescription = '',
  colonyReputationItems = [],
  permissionsItems = [],
}) => {
  const { user } = useUserByNameOrAddress(installedBy);
  const userDisplayName = user?.profile?.displayName;
  const username = user?.name;

  return (
    <div className={styles.panelRow}>
      <div className={styles.panelTitle}>{title}</div>
      <div className="flex">
        <UserAvatarPopover
          title="asdf"
          // @ts-ignore
          userName={userDisplayName || username}
          // @ts-ignore
          walletAddress={addressWallet}
          isVerified={isVerified}
          // @ts-ignore
          copyUrl={copyUrl}
          aboutDescription={aboutDescription}
          colonyReputation={colonyReputationItems}
          permissions={permissionsItems}
        />
      </div>
    </div>
  );
};

InstalledBy.displayName = displayName;

export default InstalledBy;
