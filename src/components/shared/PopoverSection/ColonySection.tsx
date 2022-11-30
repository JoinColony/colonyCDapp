import React from 'react';
import { defineMessages } from 'react-intl';

import { DropdownMenuItem, DropdownMenuSection } from '~shared/DropdownMenu';
import NavLink from '~shared/NavLink';
import { CREATE_COLONY_ROUTE } from '~routes/routeConstants';

const displayName = 'PopoverSection.ColonySection';

const MSG = defineMessages({
  createColony: {
    id: `${displayName}.createColony`,
    defaultMessage: 'Create a Colony',
  },
});

const ColonySection = () => (
  <DropdownMenuSection separator>
    <DropdownMenuItem>
      <NavLink to={CREATE_COLONY_ROUTE} text={MSG.createColony} />
    </DropdownMenuItem>
  </DropdownMenuSection>
);

ColonySection.displayName = displayName;

export default ColonySection;
