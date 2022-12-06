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

const CreateColonySection = () => (
  <DropdownMenuSection separator>
    <DropdownMenuItem>
      <NavLink to={CREATE_COLONY_ROUTE} text={MSG.createColony} />
    </DropdownMenuItem>
  </DropdownMenuSection>
);

CreateColonySection.displayName = displayName;

export default CreateColonySection;
