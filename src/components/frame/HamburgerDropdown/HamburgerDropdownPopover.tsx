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
import { useAppContext, useColonyContext } from '~hooks';

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

  return (
    <div className={styles.menu}>
      <DropdownMenu onClick={closePopover}>
        {user?.name && colony?.name && <ColonySection />}
        <UserSection />
        <CreateColonySection />
        <HelperSection />
        {wallet?.address && <MetaSection />}
      </DropdownMenu>
    </div>
  );
};

HamburgerDropdownPopover.displayName = displayName;

export default HamburgerDropdownPopover;
