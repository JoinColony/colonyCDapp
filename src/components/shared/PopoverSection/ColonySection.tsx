import React from 'react';
import { defineMessages } from 'react-intl';

import { DropdownMenuItem, DropdownMenuSection } from '~shared/DropdownMenu';
import NavLink from '~shared/NavLink';
import { useColonyContext } from '~hooks';

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
  const colonyHomePath = `/colony/${colony?.name}`;

  return (
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
        <NavLink to={`${colonyHomePath}/extensions`} text={MSG.extensions} />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );
};

ColonySection.displayName = displayName;

export default ColonySection;
