import React, { FC } from 'react';

import ColonyAvatar from '~shared/ColonyAvatar';
import TitleLabel from '~v5/shared/TitleLabel';

import { ColoniesDropdownProps } from '../types';

import ColonyItem from './ColonyItem';

const displayName =
  'common.Extensions.ColonySwitcher.partials.ColoniesDropdown';

const ColoniesDropdown: FC<ColoniesDropdownProps> = ({
  activeColony,
  activeColonyAddress,
  coloniesByCategory,
  isMobile,
}) => (
  <div className="w-full bg-base-white relative flex flex-col mb-4 sm:-mb-2">
    {!isMobile && activeColony && activeColonyAddress && (
      <div className="flex items-center pb-3.5 border-b border-gray-200">
        <div className="flex mr-2 shrink-0">
          <ColonyAvatar
            colony={activeColony}
            colonyAddress={activeColonyAddress}
            size="xxs"
          />
        </div>
        {(activeColony?.metadata?.displayName || activeColony?.name) && (
          <p className="text-2">
            {activeColony?.metadata?.displayName || activeColony?.name}
          </p>
        )}
      </div>
    )}
    {Object.keys(coloniesByCategory).map((key) => (
      <div className="px-6 sm:px-0 sm:mt-5 mb-4 last:mb-0" key={key}>
        {key && <TitleLabel text={key} />}
        {coloniesByCategory[key].map((colony) => (
          <ColonyItem
            colony={colony}
            key={colony?.colonyAddress}
            chainName={colony?.chainMetadata?.network || ''}
          />
        ))}
      </div>
    ))}
  </div>
);

ColoniesDropdown.displayName = displayName;

export default ColoniesDropdown;
