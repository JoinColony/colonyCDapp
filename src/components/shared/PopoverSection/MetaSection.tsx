import React from 'react';
import { defineMessages } from 'react-intl';

import { useAppContext } from '~hooks';
import { DropdownMenuItem, DropdownMenuSection } from '~shared/DropdownMenu';
import { formatText } from '~utils/intl';

const displayName = 'PopoverSection.MetaSection';

const MSG = defineMessages({
  signOut: {
    id: `${displayName}.signOut`,
    defaultMessage: 'Sign Out',
  },
});

const MetaSection = () => {
  const { disconnectWallet } = useAppContext();

  return (
    <DropdownMenuSection separator>
      <DropdownMenuItem>
        <button type="button" className="ml-2" onClick={disconnectWallet}>
          {formatText(MSG.signOut)}
        </button>
      </DropdownMenuItem>
    </DropdownMenuSection>
  );
};

MetaSection.displayName = displayName;

export default MetaSection;
