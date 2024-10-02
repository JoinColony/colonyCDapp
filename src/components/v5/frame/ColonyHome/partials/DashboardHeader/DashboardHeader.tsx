import React from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import NativeTokenPill from '~v5/common/NativeTokenPill/index.ts';

import ColonyLinks from './partials/ColonyLinks/index.ts';
import MembersInformation from './partials/MembersInformation/MembersInformation.tsx';

const displayName = 'v5.frame.ColonyHome.DashboardHeader';

const DashboardHeader = () => {
  const { colony } = useColonyContext();
  const { metadata, nativeToken, status } = colony;

  const colonyName = metadata?.displayName || '';
  const isNativeTokenUnlocked = !!status?.nativeToken?.unlocked;

  return (
    <div className="flex flex-col justify-between gap-4 sm:gap-[18px] lg:flex-row lg:items-center">
      <div className="flex items-center gap-4">
        <h1 className="truncate capitalize text-gray-900 heading-2">
          {colonyName}
        </h1>
        {nativeToken && (
          <NativeTokenPill
            token={nativeToken}
            isLocked={!isNativeTokenUnlocked}
          />
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-7">
        <MembersInformation />
        <div className="flex-shrink-0">
          <ColonyLinks />
        </div>
      </div>
    </div>
  );
};

DashboardHeader.displayName = displayName;

export default DashboardHeader;
