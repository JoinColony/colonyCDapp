import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

import ColonyAvatar from '~shared/ColonyAvatar';
import Icon from '~shared/Icon';
import { ColonyItemProps } from '../types';

const displayName = 'common.Extensions.partials.ColonyItem';

const ColonyItem: FC<ColonyItemProps> = ({ colony, chainName }) => (
  <div className="hover:bg-gray-50 rounded -mx-3">
    <NavLink
      title={colony?.name}
      to={`/${colony?.name}`}
      className="group block py-2 px-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex mr-2 shrink-0">
            <ColonyAvatar
              colony={colony}
              colonyAddress={colony.colonyAddress}
              size="xxs"
            />
          </div>
          <div className="text-md group-focus:text-blue-400">
            {colony?.metadata?.displayName || colony?.name}
          </div>
        </div>
        {chainName && <Icon name={chainName} appearance={{ size: 'small' }} />}
      </div>
    </NavLink>
  </div>
);

ColonyItem.displayName = displayName;

export default ColonyItem;
