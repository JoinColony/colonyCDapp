import React from 'react';
import { defineMessages } from 'react-intl';

import { ActionButton } from '~shared/Button';
import { DropdownMenuItem, DropdownMenuSection } from '~shared/DropdownMenu';
import { ActionTypes } from '~redux/actionTypes';

const displayName = 'PopoverSection.MetaSection';

const MSG = defineMessages({
  signOut: {
    id: `${displayName}.signOut`,
    defaultMessage: 'Sign Out',
  },
});

const MetaSection = () => (
  <DropdownMenuSection separator>
    <DropdownMenuItem>
      <ActionButton
        appearance={{ theme: 'no-style' }}
        text={MSG.signOut}
        submit={ActionTypes.USER_LOGOUT}
        error={ActionTypes.USER_LOGOUT_ERROR}
        success={ActionTypes.USER_LOGOUT_SUCCESS}
      />
    </DropdownMenuItem>
  </DropdownMenuSection>
);

MetaSection.displayName = displayName;

export default MetaSection;
