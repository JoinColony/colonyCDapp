import React, { type FC } from 'react';

import type { InstalledExtensionData } from '~types/extensions.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import specificSidePanelClasses from '../SpecifcSidePanel.styles.ts';
import { type PanelTypeProps } from '../types.ts';

const displayName = 'common.Extensions.partials.InstalledBy';

const InstalledBy: FC<PanelTypeProps> = ({ title, extensionData }) => {
  const installedBy = (extensionData as InstalledExtensionData)?.installedBy;

  return (
    <div className={specificSidePanelClasses.panelRow}>
      <div className={specificSidePanelClasses.panelTitle}>{title}</div>
      <div className="flex">
        <UserPopover size={20} walletAddress={installedBy} />
      </div>
    </div>
  );
};

InstalledBy.displayName = displayName;

export default InstalledBy;
