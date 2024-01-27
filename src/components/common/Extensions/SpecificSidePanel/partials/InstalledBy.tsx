import React, { FC } from 'react';

import type { InstalledExtensionData } from '~types/extensions.ts';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover/index.ts';

import { PanelTypeProps } from '../types.ts';

import styles from '../SpecificSidePanel.module.css';

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
