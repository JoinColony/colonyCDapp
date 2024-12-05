import React from 'react';

import { UserMenuItemName } from '../UserMenu/types.ts';

import Currency from './partials/Currency/Currency.tsx';
import { Tours, Contact, Developers, Legal } from './partials/index.ts';

const displayName = 'common.Extensions.UserNavigation.partials.UserSubmenu';

interface UserSubmenuProps {
  submenuId: UserMenuItemName;
  closeSubmenu: VoidFunction;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSubmenu = ({
  submenuId,
  closeSubmenu,
  setVisible,
}: UserSubmenuProps) => {
  switch (submenuId) {
    case UserMenuItemName.GUIDED_TOURS:
      return <Tours setVisible={setVisible} />;
    case UserMenuItemName.CONTACT_AND_SUPPORT:
      return <Contact />;
    case UserMenuItemName.DEVELOPERS:
      return <Developers />;
    case UserMenuItemName.LEGAL_AND_PRIVACY:
      return <Legal />;
    case UserMenuItemName.CURRENCY:
      return <Currency closeSubmenu={closeSubmenu} />;
    default:
      return null;
  }
};

UserSubmenu.displayName = displayName;

export default UserSubmenu;
