import React, { FC } from 'react';

import NativeTokenPill from '../NativeTokenPill/NativeTokenPill';

import ColonyLinks from './partials/ColonyLinks';
import { ColonyDashboardHeaderProps } from './types';

const displayName = 'v5.common.ColonyDashboardHeader';

const ColonyDashboardHeader: FC<
  Omit<
    ColonyDashboardHeaderProps,
    'leaveColonyConfirmOpen' | 'setLeaveColonyConfirm'
  >
> = ({ colonyLinksProps, colonyName, description, token, isTokenUnlocked }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-end gap-3">
      <h1 className="heading-2 text-gray-900 capitalize truncate">
        {colonyName}
      </h1>
      {token && <NativeTokenPill token={token} isLocked={!isTokenUnlocked} />}
    </div>
    <div className="flex flex-col md:flex-row gap-[1.7rem] sm:gap-4 items-start justify-between">
      <p className="text-gray-700 max-w-[52.75rem] text-md line-clamp-2">
        {description}
      </p>
      <div className="flex-shrink-0 pt-1">
        <ColonyLinks {...colonyLinksProps} />
      </div>
    </div>
  </div>
);

ColonyDashboardHeader.displayName = displayName;

export default ColonyDashboardHeader;
