import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import ColonyAvatar from '~shared/ColonyAvatar';
import Icon from '~shared/Icon';
import { IColonyItem } from './types';

const displayName = 'common.Extensions.ColonySwitcher.ColonyItem';

const ColonyItem: FC<IColonyItem> = ({ colony, chainName }) => (
  <div className="p-2 hover:bg-gray-50 rounded">
    <NavLink title={colony?.name} to={`/colony/${colony?.name}`} className="group">
      <div className="flex items-center justify-between md:mx-4">
        <div className="flex items-center">
          <div className="flex mr-2">
            <ColonyAvatar colony={colony} colonyAddress={colony?.colonyAddress} size="xxs" />
          </div>
          <div className="font-normal text-md text-gray-900 group-focus:text-blue-400">
            {colony?.metadata?.displayName || colony?.name}
          </div>
        </div>
        <div className="[&>i>svg]:w-[1.125rem] [&>i>svg]:h-[1.125rem] [&>i>svg]:stroke-base-white [&>i]:flex">
          <Icon name={chainName} />
        </div>
      </div>
    </NavLink>
  </div>
);

ColonyItem.displayName = displayName;

export default ColonyItem;
