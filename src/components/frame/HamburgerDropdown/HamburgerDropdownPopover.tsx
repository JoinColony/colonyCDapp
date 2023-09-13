import React from 'react';
// import { defineMessages } from 'react-intl';

import DropdownMenu from '~shared/DropdownMenu';
import {
  ColonySection,
  CreateColonySection,
  HelperSection,
  MetaSection,
  UserSection,
} from '~shared/PopoverSection';
import {
  useAppContext,
  useColonyContext,
  useCanInteractWithNetwork,
} from '~hooks';

import styles from './HamburgerDropdownPopover.css';

const displayName = 'frame.HamburgerDropdown.HamburgerDropdownPopover';

// const MSG = defineMessages({
//   buyTokens: {
//     id: `${displayName}.buyTokens`,
//     defaultMessage: 'Buy Tokens',
//   },
// });

interface Props {
  closePopover: () => void;
}

const HamburgerDropdownPopover = ({ closePopover }: Props) => {
  const { colony } = useColonyContext();
  const { user, wallet } = useAppContext();
  const canInteractWithNetwork = useCanInteractWithNetwork();

  return (
    <div className={styles.menu}>
      <DropdownMenu onClick={closePopover}>
        {user?.profile?.displayName && colony?.name && <ColonySection />}
        <UserSection />
        {canInteractWithNetwork && <CreateColonySection />}
        <HelperSection />
        {wallet?.address && <MetaSection />}
      </DropdownMenu>
    </div>
  );
};

HamburgerDropdownPopover.displayName = displayName;

export default HamburgerDropdownPopover;
