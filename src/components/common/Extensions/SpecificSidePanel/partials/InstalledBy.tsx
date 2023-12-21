import React, { FC } from 'react';

import styles from '../SpecificSidePanel.module.css';
import { PanelTypeProps } from '../types';
import { InstalledExtensionData } from '~types';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';

const displayName = 'common.Extensions.partials.InstalledBy';

const InstalledBy: FC<PanelTypeProps> = ({ title, extensionData }) => {
  const installedBy = (extensionData as InstalledExtensionData)?.installedBy;

  return (
    <div className={styles.panelRow}>
      <div className={styles.panelTitle}>{title}</div>
      <div className="flex">
        <UserAvatarPopover walletAddress={installedBy} />
      </div>
    </div>
  );
};

InstalledBy.displayName = displayName;

export default InstalledBy;
