import React from 'react';

import useColonyContext from '~hooks/useColonyContext';
import { formatText } from '~utils/intl';
import { multiLineTextEllipsis } from '~utils/strings';
import NativeTokenPill from '~v5/common/NativeTokenPill';

import ColonyLinks from './partials/ColonyLinks';

const displayName = 'common.ColonyHome.DashboardHeader';

const MAX_DESCRIPTION_LENGTH = 250;

const DashboardHeader = () => {
  const { colony } = useColonyContext();
  const { metadata, nativeToken, status } = colony || {};

  const colonyName = metadata?.displayName || '';
  const description = metadata?.description
    ? multiLineTextEllipsis(metadata.description, MAX_DESCRIPTION_LENGTH)
    : formatText({ id: 'colony.description' });
  const isNativeTokenUnlocked = !!status?.nativeToken?.unlocked;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        <h1 className="heading-2 text-gray-900 capitalize truncate">
          {colonyName}
        </h1>
        {nativeToken && (
          <NativeTokenPill
            token={nativeToken}
            isLocked={!isNativeTokenUnlocked}
          />
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-[1.7rem] sm:gap-4 items-start justify-between">
        <p className="text-gray-700 max-w-[52.75rem] text-md line-clamp-2">
          {description}
        </p>
        <div className="flex-shrink-0 pt-1">
          <ColonyLinks />
        </div>
      </div>
    </div>
  );
};

DashboardHeader.displayName = displayName;

export default DashboardHeader;
