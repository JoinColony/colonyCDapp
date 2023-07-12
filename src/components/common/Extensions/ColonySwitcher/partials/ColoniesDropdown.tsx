import React, { FC } from 'react';

import { Colony, WatchListItem } from '~types';
import ColonyItem from './ColonyItem';
import ColonyAvatar from '~shared/ColonyAvatar';
import { ColoniesDropdownProps } from '../types';
import { useSelectedColony } from '../hooks';
import TitleLabel from '~v5/shared/TitleLabel';

const displayName =
  'common.Extensions.ColonySwitcher.partials.ColoniesDropdown';

const ColoniesDropdown: FC<ColoniesDropdownProps> = ({
  watchlist = [],
  isMobile,
}) => {
  const { colonyToDisplay, colonyToDisplayAddress } =
    useSelectedColony(watchlist);

  const groupByCategory = (watchlist as WatchListItem[]).reduce(
    (group, item) => {
      const network = (item && item.colony.chainMetadata?.network) || '';
      // eslint-disable-next-line no-param-reassign
      group[network] = group[network] ?? [];
      group[network].push(item);
      return group;
    },
    {},
  );

  return (
    <div className="w-full bg-base-white z-50 relative flex flex-col mb-4 sm:-mb-2">
      {!isMobile && (
        <div className="flex items-center pb-3.5 border-b border-gray-200">
          <div className="flex mr-2 shrink-0">
            <ColonyAvatar
              colony={colonyToDisplay as Colony}
              colonyAddress={colonyToDisplayAddress || ''}
              size="xxs"
            />
          </div>
          {(colonyToDisplay?.metadata?.displayName ||
            colonyToDisplay?.name) && (
            <p className="text-2">
              {colonyToDisplay?.metadata?.displayName || colonyToDisplay?.name}
            </p>
          )}
        </div>
      )}
      {Object.keys(groupByCategory).map((key) => (
        <div className="px-6 sm:px-0 sm:mt-5 mb-4 last:mb-0" key={key}>
          {!!key && <TitleLabel text={key} />}
          {groupByCategory[key].map(({ colony }) => (
            <ColonyItem
              colony={colony as Colony}
              key={colony?.colonyAddress}
              chainName={colony?.chainMetadata?.network || ''}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

ColoniesDropdown.displayName = displayName;

export default ColoniesDropdown;
