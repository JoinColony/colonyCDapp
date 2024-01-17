import React from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~hooks';
import {
  COLONY_EXTENSIONS_ROUTE,
  COLONY_INCOMING_ROUTE,
  COLONY_MEMBERS_ROUTE,
} from '~routes';
import { DropdownMenuItem, DropdownMenuSection } from '~shared/DropdownMenu';
import NavLink from '~shared/NavLink';

const displayName = 'PopoverSection.ColonySection';

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
});

const ColonySection = () => {
  const { colony } = useColonyContext();
  const colonyHomePath = `/${colony.name}`;

  return (
    <DropdownMenuSection>
      <DropdownMenuItem>
        <NavLink to={colonyHomePath} text={MSG.actions} />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <NavLink
          to={`${colonyHomePath}/${COLONY_INCOMING_ROUTE}`}
          text={MSG.funds}
        />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <NavLink
          to={`${colonyHomePath}/${COLONY_MEMBERS_ROUTE}`}
          text={MSG.members}
        />
      </DropdownMenuItem>
      <DropdownMenuItem>
        <NavLink
          to={`${colonyHomePath}/${COLONY_EXTENSIONS_ROUTE}`}
          text={MSG.extensions}
        />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );
};

ColonySection.displayName = displayName;

export default ColonySection;
