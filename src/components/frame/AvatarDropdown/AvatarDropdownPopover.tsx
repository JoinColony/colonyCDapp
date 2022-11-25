import React from 'react';

import DropdownMenu from '~shared/DropdownMenu';
import UserSection from '~shared/PopoverSection/UserSection';
import ColonySection from '~shared/PopoverSection/ColonySection';
import HelperSection from '~shared/PopoverSection/HelperSection';
import MetaSection from '~shared/PopoverSection/MetaSection';

interface Props {
  closePopover: () => void;
  walletConnected?: boolean;
  preventTransactions?: boolean;
}

const displayName = 'frame.AvatarDropdown.AvatarDropdownPopover';

const AvatarDropdownPopover = ({
  closePopover,
  walletConnected = false,
  preventTransactions = false,
}: Props) => {
  return (
    <DropdownMenu onClick={closePopover}>
      {!preventTransactions ? (
        <>
          {/* Move into separate components for reuse in HamburgerDropdownPopover */}
          <UserSection />
          <ColonySection />
          <HelperSection />
          {walletConnected && <MetaSection />}
        </>
      ) : (
        walletConnected && <MetaSection />
      )}
    </DropdownMenu>
  );
};

AvatarDropdownPopover.displayName = displayName;

export default AvatarDropdownPopover;
