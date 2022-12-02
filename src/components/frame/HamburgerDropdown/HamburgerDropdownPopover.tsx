import React from 'react';
import { defineMessages } from 'react-intl';

import DropdownMenu, {
  DropdownMenuItem,
  DropdownMenuSection,
} from '~shared/DropdownMenu';
import {
  ColonySection,
  HelperSection,
  MetaSection,
  UserSection,
} from '~shared/PopoverSection';
import NavLink from '~shared/NavLink';
import { useAppContext, useColonyContext } from '~hooks';

import styles from './HamburgerDropdownPopover.css';

const displayName = 'frame.HamburgerDropdown.HamburgerDropdownPopover';

const MSG = defineMessages({
  actions: {
    id: `${displayName}.actions`,
    defaultMessage: 'Actions',
  },
  funds: {
    id: `${displayName}.funds`,
    defaultMessage: 'Funds',
  },
  members: {
    id: `${displayName}.members`,
    defaultMessage: 'Members',
  },
  extensions: {
    id: `${displayName}.extensions`,
    defaultMessage: 'Extensions',
  },
  buyTokens: {
    id: `${displayName}.buyTokens`,
    defaultMessage: 'Buy Tokens',
  },
});

interface Props {
  closePopover: () => void;
}

const HamburgerDropdownPopover = ({ closePopover }: Props) => {
  const { colony } = useColonyContext();
  const { user, wallet } = useAppContext();
  const colonyHomePath = `/colony/${colony?.name}`;

  return (
    <div className={styles.menu}>
      <DropdownMenu onClick={closePopover}>
        {user?.name && colony?.name && (
          <DropdownMenuSection>
            <DropdownMenuItem>
              <NavLink to={colonyHomePath} text={MSG.actions} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavLink to={`${colonyHomePath}/funds`} text={MSG.funds} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavLink to={`${colonyHomePath}/members`} text={MSG.members} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavLink
                to={`${colonyHomePath}/extensions`}
                text={MSG.extensions}
              />
            </DropdownMenuItem>
          </DropdownMenuSection>
        )}
        <UserSection />
        <ColonySection />
        <HelperSection />
        {wallet?.address && <MetaSection />}
      </DropdownMenu>
    </div>
  );
};

HamburgerDropdownPopover.displayName = displayName;

export default HamburgerDropdownPopover;
