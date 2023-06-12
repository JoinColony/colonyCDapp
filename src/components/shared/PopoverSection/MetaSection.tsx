import React from 'react';
import { defineMessages } from 'react-intl';

import { ActionButton } from '~shared/Button';
import { DropdownMenuItem, DropdownMenuSection } from '~shared/DropdownMenu';
import { ActionTypes } from '~redux/actionTypes';
import { useAppContext } from '~hooks';

const displayName = 'PopoverSection.MetaSection';

const MSG = defineMessages({
  signOut: {
    id: `${displayName}.signOut`,
    defaultMessage: 'Sign Out',
  },
});

const MetaSection = () => {
  const { updateWallet } = useAppContext();

  return (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <ActionButton
          appearance={{ theme: 'no-style' }}
          text={MSG.signOut}
          actionType={ActionTypes.USER_LOGOUT}
          onSuccess={updateWallet}
        />
      </DropdownMenuItem>
    </DropdownMenuSection>
  );
};

MetaSection.displayName = displayName;

export default MetaSection;
