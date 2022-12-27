import React from 'react';
import { NavLink } from 'react-router-dom';

import ColonyAvatar from '~shared/ColonyAvatar';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~shared/DropdownMenu';
import Popover from '~shared/Popover';
import { Colony } from '~types';
import { WatchListItemFragment } from '~gql';
import { useColonyContext } from '~hooks';

import styles from './SubscribedColoniesList.css';

const displayName = 'frame.SubscribedColoniesList.SubscribedColoniesDropdown';

interface Props {
  watchlist: WatchListItemFragment[];
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
            {watchlist.map(({ colony }) => (
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
            ))}
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
