import React, { FC } from 'react';
import { Colony, WatchListItem } from '~types';
import ColonyItem from './ColonyItem';
import ColonyAvatar from '~shared/ColonyAvatar';
import { ColoniesDropdownProps } from '../types';
import { useSelectedColony } from '../hooks';

const displayName = 'common.Extensions.ColonySwitcher.partials.ColoniesDropdown';

const ColoniesDropdown: FC<ColoniesDropdownProps> = ({ watchlist = [], isMobile }) => {
  const { colonyToDisplay, colonyToDisplayAddress } = useSelectedColony(watchlist);

  const groupByCategory = (watchlist as WatchListItem[]).reduce((group, item) => {
    const network = (item && item.colony.chainMetadata?.network) || '';
    // eslint-disable-next-line no-param-reassign
    group[network] = group[network] ?? [];
    group[network].push(item);
    return group;
  }, {});

  return (
    <div className="w-full bg-base-white z-50 relative flex flex-col">
      {!isMobile && (
        <>
          <div className="flex items-center py-2">
            <div className="flex mr-2">
              <ColonyAvatar
                colony={colonyToDisplay as Colony}
                colonyAddress={colonyToDisplayAddress || ''}
                size="xxs"
              />
            </div>
            <div className="font-semibold text-md text-gray-900">
              {colonyToDisplay?.metadata?.displayName || colonyToDisplay?.name}
            </div>
          </div>
          <div className="w-full h-[0.0625rem] bg-gray-200" />
        </>
      )}
      {Object.keys(groupByCategory).map((key) => (
        <div className="mt-6" key={key}>
          <div className="uppercase text-gray-400 text-xs font-medium pl-6 sm:pl-2">{key}</div>
          {groupByCategory[key].map((item) => (
            <ColonyItem
              colony={item?.colony as Colony}
              key={item?.colony?.colonyAddress}
              chainName={item?.colony?.chainMetadata?.network || ''}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

ColoniesDropdown.displayName = displayName;

export default ColoniesDropdown;
