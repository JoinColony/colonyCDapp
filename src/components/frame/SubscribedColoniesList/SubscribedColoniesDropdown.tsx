import React from 'react';
import { NavLink } from 'react-router-dom';

import { useColonyContext } from '~hooks';
import ColonyAvatar from '~shared/ColonyAvatar';
import DropdownMenu, { DropdownMenuSection } from '~shared/DropdownMenu';
import Popover from '~shared/Popover';
import { Colony } from '~types';

import ColonyListItem from './ColonyListItem';

import styles from './SubscribedColoniesList.css';

const displayName = 'frame.SubscribedColoniesList.SubscribedColoniesDropdown';

interface Props {
  watchlist: (any | null)[];
}

const SubscribedColoniesDropdown = ({ watchlist }: Props) => {
  const { colony: activeColony } = useColonyContext();

  return (
    <Popover
      renderContent={
        <DropdownMenu>
          <DropdownMenuSection>
            {watchlist.map((item) => {
              return (
                item && (
                  <ColonyListItem
                    colony={item.colony as Colony}
                    key={item.colony.colonyAddress}
                  />
                )
              );
            })}
          </DropdownMenuSection>
        </DropdownMenu>
      }
      trigger="click"
      showArrow={false}
      placement="bottom"
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 5],
            },
          },
        ],
      }}
    >
      <NavLink
        className={({ isActive }) =>
          isActive ? styles.activeColony : styles.itemLink
        }
        title={activeColony.name}
        to={`/${activeColony.name}`}
      >
        <div className={styles.itemImage}>
          <ColonyAvatar
            colony={activeColony}
            colonyAddress={activeColony.colonyAddress}
            size="xs"
          />
        </div>
      </NavLink>
    </Popover>
  );
};

SubscribedColoniesDropdown.displayName = displayName;

export default SubscribedColoniesDropdown;
