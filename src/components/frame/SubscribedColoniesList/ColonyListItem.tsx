import React from 'react';
import { NavLink } from 'react-router-dom';

import ColonyAvatar from '~shared/ColonyAvatar';
import { DropdownMenuItem } from '~shared/DropdownMenu';
import { Colony } from '~types';

import styles from './SubscribedColoniesList.css';

const displayName = 'frame.SubscribedColoniesList.ColonyListItem';

interface Props {
  colony: Colony;
}

const ColonyListItem = ({ colony }: Props) => {
  return (
    <DropdownMenuItem key={colony.colonyAddress}>
      <NavLink
        className={({ isActive }) =>
          isActive ? styles.activeColony : undefined
        }
        title={colony.name}
        to={`/colony/${colony.name}`}
      >
        <div className={styles.dropdownItem}>
          <div className={styles.itemImage}>
            <ColonyAvatar
              colony={colony}
              colonyAddress={colony.colonyAddress}
              size="xs"
            />
          </div>
          <div>{colony.profile?.displayName || colony.name}</div>
        </div>
      </NavLink>
    </DropdownMenuItem>
  );
};

ColonyListItem.displayName = displayName;

export default ColonyListItem;
