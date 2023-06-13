import React from 'react';
import { NavLink } from 'react-router-dom';

import ColonyAvatar from '~shared/ColonyAvatar';
import DropdownMenu, { DropdownMenuSection } from '~shared/DropdownMenu';
import ColonyListItem from './ColonyListItem';
import Popover from '~shared/Popover';
import { Colony, WatchListItem } from '~types';
import { useColonyContext } from '~hooks';

import styles from './SubscribedColoniesList.css';

const displayName = 'frame.SubscribedColoniesList.SubscribedColoniesDropdown';

interface Props {
  watchlist: (WatchListItem | null)[];
}

const SubscribedColoniesDropdown = ({ watchlist }: Props) => {
  const { colony: activeColony } = useColonyContext();
  const colonyToDisplay = activeColony || watchlist[0]?.colony;
  const colonyToDisplayAddress = colonyToDisplay?.colonyAddress;

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
        title={colonyToDisplay?.name}
        to={`/colony/${colonyToDisplay?.name}`}
      >
        <div className={styles.itemImage}>
          <ColonyAvatar
            colony={colonyToDisplay as Colony}
            colonyAddress={colonyToDisplayAddress || ''}
            size="xs"
          />
        </div>
      </NavLink>
    </Popover>
  );
};

SubscribedColoniesDropdown.displayName = displayName;

export default SubscribedColoniesDropdown;
